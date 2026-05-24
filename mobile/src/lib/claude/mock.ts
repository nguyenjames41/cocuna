import { triage } from '@/lib/triage';
import type { ChatMessage, RADResponse } from './schema';

export function mockRespond(messages: ChatMessage[]): RADResponse {
  const lastUser =
    [...messages].reverse().find((m) => m.role === 'user')?.content?.toLowerCase() ?? '';
  const userTurns = messages.filter((m) => m.role === 'user').length;

  // Pregnancy — decreased fetal movement (28w third-trimester)
  if (
    (lastUser.includes('movement') ||
      lastUser.includes('kick') ||
      lastUser.includes('quieter') ||
      lastUser.includes('quiet')) &&
    (lastUser.includes('pregnant') || lastUser.includes('weeks') || lastUser.includes('baby'))
  ) {
    if (userTurns >= 2) {
      const decision = triage({
        weeksPregnant: 28,
        decreasedFetalMovement: true,
      });
      return {
        acknowledgement:
          'Thank you for telling me right away. Decreased movement in the third trimester needs a same-day check.',
        followup: null,
        decision,
      };
    }
    return {
      acknowledgement: 'I want to take this seriously. A quick check first.',
      followup: {
        question: 'Have you tried lying on your left side with cold water and counting movements for an hour?',
        options: [
          { id: 'yes-still-quiet', label: 'Yes, still quiet' },
          { id: 'havent-tried', label: 'Not yet' },
          { id: 'felt-some', label: 'A few movements after that' },
        ],
      },
      decision: null,
    };
  }

  // Pregnancy — preeclampsia signs (headache + swelling/vision)
  if (
    (lastUser.includes('pregnant') || lastUser.includes('weeks')) &&
    (lastUser.includes('headache') ||
      lastUser.includes('swelling') ||
      lastUser.includes('puffy') ||
      lastUser.includes('spots') ||
      lastUser.includes('vision') ||
      lastUser.match(/\b1[4-9]\d\b/))
  ) {
    if (userTurns >= 2) {
      const decision = triage({
        weeksPregnant: 28,
        bp: { systolic: 152, diastolic: 98 },
        symptoms: ['severe-headache'],
        visualSymptoms: true,
        swelling: true,
      });
      return {
        acknowledgement: 'Headache + swelling + vision spots together is a preeclampsia pattern. Let’s get you seen today.',
        followup: null,
        decision,
      };
    }
    return {
      acknowledgement: 'Those can be preeclampsia signs. One quick clarification.',
      followup: {
        question: 'Have you had a recent BP reading at home? If yes, what was it?',
        options: [
          { id: 'high', label: 'Above 140/90' },
          { id: 'normal', label: 'Around normal' },
          { id: 'unknown', label: 'I haven’t checked' },
        ],
      },
      decision: null,
    };
  }

  // Pregnancy — preterm contractions
  if (
    lastUser.includes('contraction') &&
    (lastUser.includes('pregnant') || lastUser.includes('weeks'))
  ) {
    if (userTurns >= 2) {
      const decision = triage({
        weeksPregnant: 28,
        contractionsPerHour: 6,
      });
      return {
        acknowledgement: '6 contractions per hour at 28 weeks needs L&D right away. We’re notifying your clinic.',
        followup: null,
        decision,
      };
    }
    return {
      acknowledgement: 'Tell me a little more so I can route this fast.',
      followup: {
        question: 'How many contractions in the past hour?',
        options: [
          { id: '1-3', label: '1-3' },
          { id: '4-6', label: '4-6' },
          { id: '7+', label: '7 or more' },
        ],
      },
      decision: null,
    };
  }

  if (
    lastUser.includes('postpartum') &&
    (lastUser.includes('headache') ||
      lastUser.includes('vision') ||
      lastUser.includes('spots') ||
      lastUser.includes('blood pressure') ||
      lastUser.match(/\b1[5-9]\d\b/))
  ) {
    if (userTurns >= 3) {
      const decision = triage({
        daysPostpartum: 42,
        bp: { systolic: 158, diastolic: 102 },
        symptoms: ['severe-headache'],
        visualSymptoms: true,
        riskFactors: ['gestational-hypertension'],
      });
      return {
        acknowledgement: 'Thank you for telling me. These symptoms together are urgent.',
        followup: null,
        decision,
      };
    }
    return {
      acknowledgement:
        'I hear you. Let me ask a few specifics so we can get you the right level of care.',
      followup: {
        question:
          'Do you have any vision changes — spots, blurriness, or sensitivity to light?',
        options: [
          { id: 'yes', label: 'Yes' },
          { id: 'no', label: 'No' },
          { id: 'unsure', label: 'Not sure' },
        ],
      },
      decision: null,
    };
  }

  if (
    (lastUser.includes('baby') || lastUser.includes('infant')) &&
    (lastUser.includes('fever') ||
      lastUser.includes('temperature') ||
      lastUser.match(/\b(100|101|102|103|104)\b/))
  ) {
    if (userTurns >= 2) {
      const decision = triage({ babyAgeDays: 21, babyTempF: 100.5 });
      return {
        acknowledgement:
          'Fever in a baby under 3 months needs prompt evaluation. We are routing this now.',
        followup: null,
        decision,
      };
    }
    return {
      acknowledgement: 'OK — fever in a small baby needs careful checking. A couple of questions.',
      followup: {
        question: 'How old is your baby in weeks?',
        options: [
          { id: '0-4', label: '0-4 weeks' },
          { id: '5-12', label: '5-12 weeks' },
          { id: '13-24', label: '13-24 weeks' },
          { id: '25+', label: '6 months or older' },
        ],
      },
      decision: null,
    };
  }

  if (
    lastUser.includes('cry') ||
    lastUser.includes('detached') ||
    lastUser.includes('sad') ||
    lastUser.includes('depress') ||
    lastUser.includes('anxious') ||
    lastUser.includes('overwhelmed')
  ) {
    if (userTurns >= 3) {
      const decision = triage({ moodScore: 16 });
      return {
        acknowledgement:
          'Thank you for telling me. You deserve real support, and we will make sure you get it.',
        followup: null,
        decision,
      };
    }
    return {
      acknowledgement: 'I am glad you said something. A few gentle questions so we can route this well.',
      followup: {
        question:
          'Have you had any thoughts of harming yourself or your baby, even fleeting?',
        options: [
          { id: 'no', label: 'No' },
          { id: 'fleeting', label: 'Brief / fleeting' },
          { id: 'yes', label: 'Yes' },
        ],
      },
      decision: null,
    };
  }

  return {
    acknowledgement: 'Thank you for reaching out. Tell me a little more so we can route this properly.',
    followup: {
      question: 'Is this about you, your baby, or both?',
      options: [
        { id: 'me', label: 'Me' },
        { id: 'baby', label: 'My baby' },
        { id: 'both', label: 'Both' },
      ],
    },
    decision: null,
  };
}
