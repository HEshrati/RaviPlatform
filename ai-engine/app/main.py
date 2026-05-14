"""
Ravi AI Matching Engine v2.0
─────────────────────────────────────────────────────────────────
کاملاً بازنویسی شده بر اساس ساختار واقعی داده‌های پلتفرم:
  - Profile:      interests[] فارسی، city، age
  - SmartProfile: communication_type، dominant_need،
                  interaction_rhythm، extroversion_score،
                  energy_level، no_show_count، return_rate،
                  matching_weights، preferred_event_types
─────────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import math
from typing import Any

import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="Ravi AI Matching Engine", version="2.0.0")

# ══════════════════════════════════════════════════════════════════
# ۱. نگاشت علایق فارسی → دسته‌بندی
# ══════════════════════════════════════════════════════════════════
INTEREST_MAP: dict[str, str] = {
    # هنر و خلاقیت
    "موسیقی": "art", "نقاشی": "art", "سینما": "art",
    "تئاتر": "art", "عکاسی": "art", "رقص": "art",
    "هنر": "art", "خوانندگی": "art", "طراحی": "art",
    "نویسندگی": "art", "شعر": "art",

    # ورزش و فعالیت بدنی
    "ورزش": "sports", "کوهنوردی": "sports", "یوگا": "sports",
    "شنا": "sports", "دوچرخه‌سواری": "sports", "پیاده‌روی": "sports",
    "فوتبال": "sports", "والیبال": "sports", "بدمینتون": "sports",
    "کمپینگ": "sports", "طبیعت‌گردی": "sports",

    # فکری و فرهنگی
    "کتاب": "intellectual", "فلسفه": "intellectual",
    "تاریخ": "intellectual", "علم": "intellectual",
    "روانشناسی": "intellectual", "اقتصاد": "intellectual",
    "سیاست": "intellectual",

    # اجتماعی و سفر
    "سفر": "social", "آشپزی": "social", "گردشگری": "social",
    "کافه‌گردی": "social", "رستوران": "social",

    # فناوری و دیجیتال
    "تکنولوژی": "tech", "کامپیوتر": "tech", "برنامه‌نویسی": "tech",
    "هوش مصنوعی": "tech", "گیم": "gaming", "بازی": "gaming",

    # ذهنی و معنوی
    "مدیتیشن": "mindfulness", "یوگا": "mindfulness",
    "معنویت": "mindfulness", "رشد فردی": "mindfulness",
}

INTEREST_CATEGORIES = list(dict.fromkeys(INTEREST_MAP.values()))  # unique

# ══════════════════════════════════════════════════════════════════
# ۲. ماتریس سازگاری تیپ ارتباطی
#    introvert / extrovert / ambivert
# ══════════════════════════════════════════════════════════════════
COMM_COMPAT: dict[tuple[str, str], float] = {
    ("introvert",  "introvert"):  0.88,
    ("introvert",  "ambivert"):   0.92,
    ("introvert",  "extrovert"):  0.55,
    ("extrovert",  "extrovert"):  0.85,
    ("extrovert",  "ambivert"):   0.92,
    ("ambivert",   "ambivert"):   1.00,
}

def comm_type_score(a: str | None, b: str | None) -> float:
    if not a or not b:
        return 0.72  # بدون داده — نه تشویق نه تنبیه
    key = tuple(sorted([a.lower(), b.lower()]))
    return COMM_COMPAT.get(key, 0.60)  # type: ignore[arg-type]


# ══════════════════════════════════════════════════════════════════
# ۳. ماتریس سازگاری نیاز غالب
#    seen / security / meaning / fun / entertainment
# ══════════════════════════════════════════════════════════════════
NEED_COMPAT: dict[tuple[str, str], float] = {
    ("seen",          "seen"):          0.45,  # رقابت برای توجه
    ("seen",          "meaning"):       0.90,
    ("seen",          "security"):      0.80,
    ("seen",          "fun"):           0.85,
    ("seen",          "entertainment"): 0.85,
    ("security",      "security"):      0.92,
    ("security",      "meaning"):       0.88,
    ("security",      "fun"):           0.70,
    ("security",      "entertainment"): 0.70,
    ("meaning",       "meaning"):       0.95,
    ("meaning",       "fun"):           0.75,
    ("meaning",       "entertainment"): 0.72,
    ("fun",           "fun"):           1.00,
    ("fun",           "entertainment"): 0.98,
    ("entertainment", "entertainment"): 1.00,
}

def dominant_need_score(a: str | None, b: str | None) -> float:
    if not a or not b:
        return 0.75
    key = tuple(sorted([a.lower(), b.lower()]))
    return NEED_COMPAT.get(key, 0.70)  # type: ignore[arg-type]


# ══════════════════════════════════════════════════════════════════
# ۴. نرمال‌سازی شهر (فارسی + انگلیسی)
# ══════════════════════════════════════════════════════════════════
CITY_NORM: dict[str, str] = {
    "tehran": "تهران", "تهران": "تهران",
    "mashhad": "مشهد", "مشهد": "مشهد",
    "isfahan": "اصفهان", "اصفهان": "اصفهان",
    "shiraz": "شیراز", "شیراز": "شیراز",
    "tabriz": "تبریز", "تبریز": "تبریز",
    "karaj": "کرج", "کرج": "کرج",
    "qom": "قم", "قم": "قم",
    "ahvaz": "اهواز", "اهواز": "اهواز",
    "rasht": "رشت", "رشت": "رشت",
    "yazd": "یزد", "یزد": "یزد",
    "kish": "کیش", "کیش": "کیش",
}

def normalize_city(city: str | None) -> str | None:
    if not city:
        return None
    return CITY_NORM.get(city.strip().lower(), city.strip())

def city_score(user_city: str | None, event_city: str | None) -> float:
    u = normalize_city(user_city)
    e = normalize_city(event_city)
    if not u or not e:
        return 0.55
    if u == e:
        return 1.00
    # شهرهای نزدیک (مثلاً تهران-کرج)
    nearby = {("تهران", "کرج"), ("کرج", "تهران")}
    if (u, e) in nearby:
        return 0.75
    return 0.20


# ══════════════════════════════════════════════════════════════════
# ۵. امتیاز علایق با Jaccard + وزن دسته‌بندی
# ══════════════════════════════════════════════════════════════════
def interests_score(user_interests: list[str], event_tags: list[str]) -> float:
    if not user_interests and not event_tags:
        return 0.60
    if not user_interests or not event_tags:
        return 0.40

    # نگاشت به دسته‌بندی
    user_cats  = {INTEREST_MAP.get(i, i.lower()) for i in user_interests}
    event_cats = {INTEREST_MAP.get(t, t.lower()) for t in event_tags}

    intersection = user_cats & event_cats
    union = user_cats | event_cats

    jaccard = len(intersection) / len(union) if union else 0.0

    # اگر هیچ دسته مشترکی نداشتیم ولی رشته‌های خام مشترک داریم
    if jaccard == 0.0:
        raw_user  = {i.strip().lower() for i in user_interests}
        raw_event = {t.strip().lower() for t in event_tags}
        raw_overlap = raw_user & raw_event
        if raw_overlap:
            jaccard = len(raw_overlap) / len(raw_user | raw_event)

    return round(jaccard, 4)


# ══════════════════════════════════════════════════════════════════
# ۶. امتیاز سن
# ══════════════════════════════════════════════════════════════════
def age_score(age: int | None, min_age: int | None, max_age: int | None) -> float:
    if age is None:
        return 0.75
    if min_age is not None and age < min_age:
        gap = min_age - age
        return max(0.0, 1.0 - gap / 10.0)
    if max_age is not None and age > max_age:
        gap = age - max_age
        return max(0.0, 1.0 - gap / 10.0)
    return 1.0


# ══════════════════════════════════════════════════════════════════
# ۷. امتیاز قابلیت اعتماد (no_show + return_rate)
# ══════════════════════════════════════════════════════════════════
def reliability_score(no_show_count: int, return_rate: float) -> float:
    # تنبیه برای no_show: هر بار ۲۵٪ کاهش (حداقل ۰)
    penalty = max(0.0, 1.0 - no_show_count * 0.25)
    # پاداش برای return_rate (0-100 → 0-1)
    bonus = min(1.0, return_rate / 100.0)
    score = 0.65 * penalty + 0.35 * bonus
    return round(score, 4)


# ══════════════════════════════════════════════════════════════════
# ۸. سازگاری سطح انرژی
# ══════════════════════════════════════════════════════════════════
def energy_score(user_energy: float, event_energy_target: float | None) -> float:
    if event_energy_target is None:
        return 0.80
    diff = abs(user_energy - event_energy_target) / 100.0
    # هرچه فاصله کمتر، امتیاز بیشتر
    return round(1.0 - diff * 0.8, 4)


# ══════════════════════════════════════════════════════════════════
# ۹. مدل‌های Pydantic — ورودی/خروجی
# ══════════════════════════════════════════════════════════════════
class UserProfile(BaseModel):
    userId: str

    # از Profile entity
    city: str | None = None
    age: int | None = None
    gender: str | None = None
    interests: list[str] = Field(default_factory=list)

    # از SmartProfile entity
    communication_type: str | None = None     # introvert/extrovert/ambivert
    dominant_need: str | None = None          # seen/security/meaning/fun/entertainment
    interaction_rhythm: str | None = None     # active/cautious/observer
    extroversion_score: float = 50.0          # 0-100
    energy_level: float = 50.0               # 0-100
    preferred_event_types: list[str] = Field(default_factory=list)
    next_event_interests: list[str] = Field(default_factory=list)

    # قابلیت اعتماد
    no_show_count: int = 0
    return_rate: float = 0.0
    smart_score: float = 0.0

    # وزن‌های شخصی‌سازی‌شده (از matching_weights)
    age_importance: float = 1.0
    location_importance: float = 1.0
    personality_importance: float = 1.0


class EventProfile(BaseModel):
    id: str
    city: str | None = None
    tags: list[str] = Field(default_factory=list)          # علایق هدف رویداد

    # هدف رویداد برای matching
    target_communication_type: str | None = None   # introvert/extrovert/ambivert/all
    target_dominant_need: str | None = None
    event_type: str | None = None                  # کافه/کوه/سینما/...
    target_age_min: int | None = None
    target_age_max: int | None = None
    target_gender: str | None = None               # all/male/female
    energy_target: float | None = None             # 0-100


class MatchRequest(BaseModel):
    event: EventProfile
    users: list[UserProfile]


class GroupMatchRequest(BaseModel):
    """برای createSmartGroups — تشکیل گروه‌های همگن"""
    eventId: str
    users: list[UserProfile]
    group_size: int = 5
    strategy: str = "mixed"  # similar / mixed / complementary


# ══════════════════════════════════════════════════════════════════
# ۱۰. محاسبه امتیاز نهایی برای یک کاربر × رویداد
# ══════════════════════════════════════════════════════════════════
DEFAULT_WEIGHTS = {
    "interests":     0.28,
    "personality":   0.22,
    "city":          0.20,
    "reliability":   0.15,
    "age":           0.10,
    "energy":        0.05,
}

def compute_match_score(user: UserProfile, event: EventProfile) -> dict[str, Any]:
    # ترکیب interests از profile و smart_profile
    all_interests = list({*user.interests, *user.next_event_interests})

    # ── امتیازهای جزئی ──────────────────────────────────────────
    s_interests   = interests_score(all_interests, event.tags)
    s_comm        = comm_type_score(user.communication_type, event.target_communication_type)
    s_need        = dominant_need_score(user.dominant_need, event.target_dominant_need)
    s_city        = city_score(user.city, event.city)
    s_reliability = reliability_score(user.no_show_count, user.return_rate)
    s_age         = age_score(user.age, event.target_age_min, event.target_age_max)
    s_energy      = energy_score(user.energy_level, event.energy_target)

    # ── وزن‌های ترکیبی شخصی‌سازی‌شده ───────────────────────────
    w = dict(DEFAULT_WEIGHTS)
    w["city"]        *= user.location_importance
    w["age"]         *= user.age_importance
    w["personality"] = (w["personality"] * user.personality_importance
                        if "personality" in w else 0.22)

    # ── امتیاز شخصیت = میانگین comm_type و dominant_need ────────
    s_personality = (s_comm + s_need) / 2.0

    # ── نرمال‌سازی وزن‌ها ───────────────────────────────────────
    total_w = (w["interests"] + w["personality"] + w["city"]
               + w["reliability"] + w["age"] + w["energy"])
    nw = {k: v / total_w for k, v in w.items()}

    # ── امتیاز نهایی ─────────────────────────────────────────────
    final_score = (
        nw["interests"]   * s_interests   +
        nw["personality"] * s_personality +
        nw["city"]        * s_city        +
        nw["reliability"] * s_reliability +
        nw["age"]         * s_age         +
        nw["energy"]      * s_energy
    )

    # smart_score بونوس جزئی (حداکثر ۵٪)
    if user.smart_score > 0:
        final_score = final_score * 0.97 + (user.smart_score / 100.0) * 0.03

    final_score = round(min(1.0, max(0.0, final_score)), 4)

    return {
        "userId":       user.userId,
        "eventId":      event.id,
        "finalScore":   final_score,
        "percentage":   round(final_score * 100, 1),
        "breakdown": {
            "interests":   round(s_interests,   4),
            "comm_type":   round(s_comm,         4),
            "dominant_need": round(s_need,       4),
            "personality": round(s_personality,  4),
            "city":        round(s_city,         4),
            "reliability": round(s_reliability,  4),
            "age":         round(s_age,          4),
            "energy":      round(s_energy,       4),
        },
        "weights":      {k: round(v, 3) for k, v in nw.items()},
        "explanation": _build_explanation(
            user, s_interests, s_personality, s_city, s_reliability, final_score
        ),
    }


def _build_explanation(
    user: UserProfile,
    s_int: float, s_per: float, s_city: float, s_rel: float, final: float
) -> str:
    parts = []
    if s_int >= 0.70:
        parts.append("علایق مشترک بالا")
    if s_per >= 0.85:
        parts.append("تیپ شخصیتی همخوان")
    if s_city == 1.0:
        parts.append(f"شهر یکسان ({user.city})")
    if s_rel >= 0.80:
        parts.append("سابقه حضور خوب")
    if user.no_show_count >= 2:
        parts.append(f"⚠️ {user.no_show_count} بار عدم حضور")
    if not parts:
        parts.append("تطابق پایه")
    return " • ".join(parts) + f" — امتیاز کلی: {round(final*100)}٪"


# ══════════════════════════════════════════════════════════════════
# ۱۱. تشکیل گروه‌های هوشمند (createSmartGroups)
# ══════════════════════════════════════════════════════════════════
def build_smart_groups(
    users: list[UserProfile],
    group_size: int,
    strategy: str,
) -> list[list[str]]:
    """
    تقسیم کاربران به گروه‌های متعادل
    strategy:
      similar      → کاربران مشابه کنار هم
      complementary→ کاربران مکمل کنار هم
      mixed        → ترکیب هر دو (پیش‌فرض)
    """
    if not users:
        return []

    n = len(users)

    if n <= group_size:
        return [[u.userId for u in users]]

    # ساخت feature vector برای هر کاربر
    def make_vector(u: UserProfile) -> np.ndarray:
        comm_map = {"introvert": 0.0, "ambivert": 0.5, "extrovert": 1.0}
        need_map  = {"seen": 0, "security": 1, "meaning": 2,
                     "fun": 3, "entertainment": 3}
        rhythm_map = {"observer": 0, "cautious": 0.5, "active": 1}
        comm_v  = comm_map.get((u.communication_type or "").lower(), 0.5)
        need_v  = need_map.get((u.dominant_need or "").lower(), 2) / 4.0
        rhythm_v = rhythm_map.get((u.interaction_rhythm or "").lower(), 0.5)
        return np.array([
            u.extroversion_score / 100.0,
            u.energy_level / 100.0,
            comm_v, need_v, rhythm_v,
            min(1.0, u.no_show_count / 4.0),   # reliability penalty
            u.return_rate / 100.0,
        ])

    vectors = np.array([make_vector(u) for u in users])

    # شاخص ترتیب امتیاز کلی (smart_score + return_rate)
    ranking = sorted(
        range(n),
        key=lambda i: users[i].smart_score * 0.6 + users[i].return_rate * 0.4,
        reverse=True,
    )

    if strategy == "similar":
        # گروه‌بندی بر اساس cosine similarity — کلاستر ساده
        from sklearn.cluster import KMeans
        n_clusters = max(1, math.ceil(n / group_size))
        labels = KMeans(
            n_clusters=n_clusters, random_state=42, n_init="auto"
        ).fit_predict(vectors)
        groups: list[list[str]] = [[] for _ in range(n_clusters)]
        for i, u in enumerate(users):
            groups[labels[i]].append(u.userId)
        return [g for g in groups if g]

    elif strategy == "complementary":
        # جفت‌سازی درون‌گرا با برون‌گرا، مشابه دوست‌یابی
        sorted_ext = sorted(range(n), key=lambda i: vectors[i][0])
        groups = []
        used = [False] * n
        for i in sorted_ext:
            if used[i]:
                continue
            group = [users[i].userId]
            used[i] = True
            # پیدا کردن مکمل‌ترین کاربران
            sims = [(j, float(cosine_similarity(
                vectors[i].reshape(1, -1),
                vectors[j].reshape(1, -1)
            )[0][0])) for j in range(n) if not used[j]]
            # complementary = کمترین similarity
            sims.sort(key=lambda x: x[1])
            for j, _ in sims[:group_size - 1]:
                group.append(users[j].userId)
                used[j] = True
            groups.append(group)
        return groups

    else:  # mixed (default)
        # گروه‌بندی snake-draft: ترکیب top + bottom برای هر گروه
        num_groups = max(1, math.ceil(n / group_size))
        groups = [[] for _ in range(num_groups)]
        for pos, idx in enumerate(ranking):
            g = pos % num_groups if (pos // num_groups) % 2 == 0 \
                else (num_groups - 1 - pos % num_groups)
            groups[g].append(users[idx].userId)
        return [g for g in groups if g]


# ══════════════════════════════════════════════════════════════════
# ۱۲. Endpoints
# ══════════════════════════════════════════════════════════════════

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "version": "2.0.0"}


@app.post("/match")
def match_users(payload: MatchRequest) -> dict[str, Any]:
    """
    امتیازدهی کاربران برای یک رویداد مشخص
    POST /match
    {
      "event": { "id": "...", "city": "تهران", "tags": ["موسیقی","هنر"], ... },
      "users": [ { "userId": "...", "city": "تهران", "interests": ["موسیقی"], ... } ]
    }
    """
    event = payload.event
    results = [compute_match_score(u, event) for u in payload.users]
    results.sort(key=lambda r: r["finalScore"], reverse=True)

    return {
        "eventId": event.id,
        "totalCandidates": len(results),
        "matches": results,
    }


@app.post("/group-match")
def group_match(payload: GroupMatchRequest) -> dict[str, Any]:
    """
    تشکیل گروه‌های هوشمند برای یک رویداد
    POST /group-match
    {
      "eventId": "...",
      "users": [...],
      "group_size": 5,
      "strategy": "mixed"
    }
    """
    groups = build_smart_groups(payload.users, payload.group_size, payload.strategy)
    return {
        "eventId": payload.eventId,
        "strategy": payload.strategy,
        "totalUsers": len(payload.users),
        "totalGroups": len(groups),
        "groups": [{"groupIndex": i, "userIds": g} for i, g in enumerate(groups)],
    }


@app.post("/score-pair")
def score_pair(body: dict[str, Any]) -> dict[str, Any]:
    """
    امتیاز تطابق بین دو کاربر (بدون رویداد)
    POST /score-pair
    { "userA": {...}, "userB": {...} }
    """
    a = UserProfile(**body["userA"])
    b = UserProfile(**body["userB"])

    s_comm = comm_type_score(a.communication_type, b.communication_type)
    s_need = dominant_need_score(a.dominant_need, b.dominant_need)
    s_city = city_score(a.city, b.city)
    all_a  = list({*a.interests, *a.next_event_interests})
    all_b  = list({*b.interests, *b.next_event_interests})
    s_int  = interests_score(all_a, all_b)

    s_energy = 1.0 - abs(a.energy_level - b.energy_level) / 100.0
    s_rel_a  = reliability_score(a.no_show_count, a.return_rate)
    s_rel_b  = reliability_score(b.no_show_count, b.return_rate)
    s_rel    = (s_rel_a + s_rel_b) / 2.0

    final = round(
        0.28 * s_int + 0.25 * (s_comm + s_need) / 2 +
        0.20 * s_city + 0.15 * s_rel + 0.07 * s_energy +
        0.05 * min(1.0, (a.smart_score + b.smart_score) / 200.0),
        4,
    )

    return {
        "userA": a.userId,
        "userB": b.userId,
        "compatibilityScore": final,
        "percentage": round(final * 100, 1),
        "breakdown": {
            "interests": round(s_int, 4),
            "comm_type": round(s_comm, 4),
            "dominant_need": round(s_need, 4),
            "city": round(s_city, 4),
            "energy": round(s_energy, 4),
            "reliability": round(s_rel, 4),
        },
    }
