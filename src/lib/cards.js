// Standard TWI card wording, from the U.S. War Manpower Commission's Training
// Within Industry pocket cards (1943–44), which are U.S. government works and
// public domain. The only edit is gender-neutral phrasing ("him" → "the
// person"/"them"). To change the wording, edit the text here; the screens
// render whatever is in this file.
//
// Each card: id (matches the database's card column), tab label, color
// (the printed card's paper color; shades are set in index.css), title,
// subtitle, optional "before" sections, numbered steps, and a closing line.

export const CARDS = [
  {
    id: 'ji',
    tab: 'Instruction',
    short: 'JI',
    color: 'blue', // TWI Job Instruction card is blue
    title: 'Job Instruction',
    subtitle: 'How to instruct',
    before: {
      heading: 'How to get ready to instruct',
      items: [
        {
          title: 'Have a timetable',
          text: 'How much skill you expect the person to have, by what date.'
        },
        {
          title: 'Break down the job',
          text: 'List the important steps. Pick out the key points. (Safety is always a key point.)'
        },
        {
          title: 'Have everything ready',
          text: 'The right equipment, materials, and supplies.'
        },
        {
          title: 'Have the workplace properly arranged',
          text: 'Just as the worker will be expected to keep it.'
        }
      ]
    },
    stepsHeading: 'How to instruct',
    steps: [
      {
        title: 'Prepare the worker',
        points: [
          'Put the person at ease.',
          'State the job and find out what the person already knows about it.',
          'Get the person interested in learning the job.',
          'Place the person in the correct position.'
        ]
      },
      {
        title: 'Present the operation',
        points: [
          'Tell, show, and illustrate one important step at a time.',
          'Stress each key point.',
          'Instruct clearly, completely, and patiently, but no more than they can master.'
        ]
      },
      {
        title: 'Try out performance',
        points: [
          'Have the person do the job; correct errors.',
          'Have the person explain each key point to you as they do the job again.',
          'Make sure they understand.',
          'Continue until you know they know.'
        ]
      },
      {
        title: 'Follow up',
        points: [
          'Put the person on their own.',
          'Designate who they go to for help.',
          'Check frequently.',
          'Encourage questions.',
          'Taper off extra coaching and close follow-up.'
        ]
      }
    ],
    closing: 'If the worker hasn’t learned, the instructor hasn’t taught.'
  },
  {
    id: 'jm',
    tab: 'Methods',
    short: 'JM',
    color: 'green', // TWI Job Methods card is green
    title: 'Job Methods',
    subtitle: 'How to improve job methods',
    intro:
      'A practical plan to help you produce greater quantities of quality products in less time, by making the best use of the people, machines, and materials now available.',
    stepsHeading: 'How to improve job methods',
    steps: [
      {
        title: 'Break down the job',
        points: [
          'List all details of the job exactly as done by the present method.',
          'Be sure details include all material handling, machine work, and hand work.'
        ]
      },
      {
        title: 'Question every detail',
        points: [
          'Use these types of questions: Why is it necessary? What is its purpose? Where should it be done? When should it be done? Who is best qualified to do it? How is the best way to do it?',
          'Also question the materials, machines, equipment, tools, product design, layout, workplace, safety, and housekeeping.'
        ]
      },
      {
        title: 'Develop the new method',
        points: [
          'Eliminate unnecessary details.',
          'Combine details when practical.',
          'Rearrange for better sequence.',
          'Simplify all necessary details: make the work easier and safer; pre-position materials, tools, and equipment at the best places in the proper work area; use gravity-feed hoppers and drop-delivery chutes; let both hands do useful work; use jigs and fixtures instead of hands for holding work.',
          'Work out your idea with others.',
          'Write up your proposed new method.'
        ]
      },
      {
        title: 'Apply the new method',
        points: [
          'Sell your proposal to your supervisor.',
          'Sell the new method to the operators.',
          'Get final approval of all concerned on safety, quality, quantity, and cost.',
          'Put the new method to work. Use it until a better way is developed.',
          'Give credit where credit is due.'
        ]
      }
    ]
  },
  {
    id: 'jr',
    tab: 'Relations',
    short: 'JR',
    color: 'yellow', // TWI Job Relations card is yellow
    title: 'Job Relations',
    subtitle: 'A supervisor gets results through people',
    before: {
      heading: 'Foundations for good relations',
      items: [
        {
          title: 'Let each worker know how they are getting along',
          text: 'Figure out what you expect of them. Point out ways to improve.'
        },
        {
          title: 'Give credit when due',
          text: 'Look for extra or unusual performance. Tell them while it’s hot.'
        },
        {
          title: 'Tell people in advance about changes that will affect them',
          text: 'Tell them why if possible. Get them to accept the change.'
        },
        {
          title: 'Make best use of each person’s ability',
          text: 'Look for ability not now being used. Never stand in a person’s way.'
        }
      ],
      footer: 'People must be treated as individuals.'
    },
    stepsHeading: 'How to handle a problem',
    stepsIntro: 'Determine the objective.',
    steps: [
      {
        title: 'Get the facts',
        points: [
          'Review the record.',
          'Find out what rules and plant customs apply.',
          'Talk with the individuals concerned.',
          'Get opinions and feelings.',
          'Be sure you have the whole story.'
        ]
      },
      {
        title: 'Weigh and decide',
        points: [
          'Fit the facts together.',
          'Consider their bearing on each other.',
          'What possible actions are there?',
          'Check practices and policies.',
          'Consider the objective and the effect on the individual, the group, and production.',
          'Don’t jump to conclusions.'
        ]
      },
      {
        title: 'Take action',
        points: [
          'Are you going to handle this yourself?',
          'Do you need help in handling it?',
          'Should you refer this to your supervisor?',
          'Watch the timing of your action.',
          'Don’t pass the buck.'
        ]
      },
      {
        title: 'Check results',
        points: [
          'How soon will you follow up?',
          'How often will you need to check?',
          'Watch for changes in output, attitudes, and relationships.',
          'Did your action help production?'
        ]
      }
    ],
    closing: 'Did you accomplish your objective?'
  }
]

export const CARD_BY_ID = Object.fromEntries(CARDS.map((c) => [c.id, c]))

// Where people create an account; TWI uses the same logins as Kata.
export const KATA_APP_URL = 'https://kata-tracker-one.vercel.app/'

// How long a card must stay on screen before it counts as an open.
export const VIEW_THRESHOLD_MS = 5000
