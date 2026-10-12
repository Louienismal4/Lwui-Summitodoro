export type ReleaseCategory = 'added' | 'changed' | 'fixed'

export type Release = {
  version: string
  date: string
  title: string
  categories: {
    added: string[]
    changed: string[]
    fixed: string[]
  }
}

export const RELEASES: Release[] = [
  {
    version: '2.1.0',
    date: 'August 2026',
    title: 'Seamless sign-in & trail presence sync! 🌲',
    categories: {
      added: [],
      changed: [
        "Enhanced the Sign-In button with the official logo and clearer 'Sign in with Google' prompt across all dialogs.",
        'Streamlined the guest option into a clean, text-only link neatly paired directly beneath the Google button.',
      ],
      fixed: [
        'Fixed friend presence position syncing in focus rooms so companions on the trail update in real time without errors.',
        'Fixed an issue where continuing as a guest and then signing in with Google kept the account locked in guest mode.',
        'Improved authentication callback handling and session cookie persistence when signing in.',
      ],
    },
  },
  {
    version: '2.0.0',
    date: 'July 2026',
    title: 'Co-op hiking is here!!! 🎉',
    categories: {
      added: [
        'Co-op feature!!! You and your friends can hike together now!! Whoooo!! Create a private room, invite up to five trail buddies, and see everyone moving on the map.',
        "No need to match each other's pace — everyone can pick their own mountain and run their own timer while still sharing the adventure.",
        "Your Friends panel now shows the whole trail crew, everyone's level, who is hosting, and a quick way to head out when the hike is done.",
        'Finish a hike with friends around and grab bonus points for bringing the good vibes to the trail!',
        'Your browser tab now shows the time left, so your climb stays with you even when you peek at another tab.',
        'Summitodoro migrated to AWS! ☁️',
      ],
      changed: [
        'Notifications now glide in and out more smoothly — no more blink-and-you-miss-it trail updates!',
        'Your map can follow your hiker when you want it to, then lets you roam around and explore whenever the mood hits.',
        'Task planning is easier to scan, with clearer actions and more room for all your big plans.',
      ],
      fixed: [
        'If you get kicked from a friend room, you will get a clear heads-up right away — no confusing disappearing act.',
        'Got kicked by accident? You get one quick rejoin. If it happens again, take a five-minute breather, then come back stronger!',
        'Invite codes now come with a friendly reminder: keep the crew safe and only share them with people you know and trust.',
      ],
    },
  },
  {
    version: '1.2.0',
    date: 'July 2026',
    title: 'Your hike got a power-up!',
    categories: {
      added: [
        "Earn Trail Coins, level up, and unlock new mountains as your focus streak gets stronger. Let's gooo!",
        'Sign in with Google to keep your hiker profile, progress, focus time, and summit history safe for the next climb.',
        'A quick welcome tour helps new hikers hit the trail with confidence.',
        'Pick a background stream and make your climb feel like your own little basecamp.',
      ],
      changed: [
        'Mt. Pinatubo is ready for your first climb, while new routes are waiting for you to unlock them.',
        'Your profile, coins, route goals, and timers are easier to spot when you need them.',
        'Your profile photo can now hike right alongside you on the map!',
        'The mountain picker got a more visual, mobile-friendly glow-up.',
      ],
      fixed: [
        "Mt. Pulag's summit now stays put while you zoom around the trail. No more runaway peak!",
      ],
    },
  },
  {
    version: '1.1.0',
    date: 'July 2026',
    title: 'More trails, more adventures!',
    categories: {
      added: [
        'Mt. Ulap, Mt. Pulag, and Mt. Pinatubo joined the adventure. Big mountain energy!',
        'Take checkpoint breaks and pick a focus length that fits your day — your hike, your pace.',
      ],
      changed: [
        'The map became smoother and easier to explore. Go wander a little!',
      ],
      fixed: [],
    },
  },
  {
    version: '1.0.0',
    date: 'Initial release',
    title: 'The first ascent!',
    categories: {
      added: [
        'The first virtual Philippine mountain focus adventure. The climb starts here!',
        'A timer that remembers your climb, plus XP and a reliable trail view to keep you moving.',
      ],
      changed: [],
      fixed: [],
    },
  },
]
