"""Deterministic LCR aggregation shared by manual and automatic debate endings."""

import math


WEIGHTS = {"logic": 0.40, "credibility": 0.35, "rhetoric": 0.25}


def valid_feedback(feedback):
    return isinstance(feedback, dict) and all(
        isinstance(feedback.get(key), (int, float))
        and not isinstance(feedback.get(key), bool)
        and math.isfinite(feedback[key])
        and 0 <= feedback[key] <= 10
        for key in WEIGHTS
    )


def aggregate_debate_scores(participants, turns):
    debaters = [participant for participant in participants
                if participant.get("role") == "debater"]
    scores = {}
    feedback_by_participant = {}
    all_judged = len(debaters) >= 2
    for participant in debaters:
        participant_id = str(participant["id"])
        own_turns = [turn for turn in turns
                     if str(turn.get("speaker_id")) == participant_id]
        judged_turns = [turn for turn in own_turns
                        if valid_feedback(turn.get("ai_feedback"))]
        if not own_turns or len(judged_turns) != len(own_turns):
            all_judged = False
        if not judged_turns:
            continue
        averages = {key: sum(turn["ai_feedback"][key] for turn in judged_turns)
                    / len(judged_turns) for key in WEIGHTS}
        weighted = sum(averages[key] * weight for key, weight in WEIGHTS.items())
        scores[participant_id] = {**averages, "weighted_total": weighted,
                                  "total": weighted}
        strengths = [item for turn in judged_turns
                     for item in turn["ai_feedback"].get("strengths", [])
                     if isinstance(item, str)]
        weaknesses = [item for turn in judged_turns
                      for item in turn["ai_feedback"].get("weaknesses", [])
                      if isinstance(item, str)]
        feedback_by_participant[participant_id] = {
            "strengths": list(dict.fromkeys(strengths))[:5],
            "weaknesses": list(dict.fromkeys(weaknesses))[:5],
        }

    winner_id = None
    if all_judged and len(scores) == len(debaters):
        ranking = sorted(scores, key=lambda key: scores[key]["weighted_total"],
                         reverse=True)
        if scores[ranking[0]]["weighted_total"] > scores[ranking[1]]["weighted_total"] + 1e-9:
            winner_id = ranking[0]
    return scores, feedback_by_participant, all_judged, winner_id
