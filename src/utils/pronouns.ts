const pink = "#E633C7"
const purple = "#9B33E6"
const grey = "#807694"
const blue = "#15AEEF"

export type Pronoun = {
    // the pronoun key
    name: string
    // the UI display value
    display: string
}

// Adapted from: https://github.com/techygrrrl/chat-pronouns-twitch-alejo47/blob/main/src/ts/constants/colours.ts
export const pronounToColourMap: Record<string, string> = {
    "aeaer": purple,
    "any": purple,
    "eem": purple,
    "faefaer": purple,
    "hehim": blue,
    "heshe": purple,
    "hethem": blue,
    "itits": grey,
    "other": purple,
    "perper": purple,
    "sheher": pink,
    "shethem": pink,
    "theythem": purple,
    "vever": purple,
    "xexem": purple,
    "ziehir": purple,
}

// Adapted from: https://github.com/techygrrrl/chat-pronouns-twitch-alejo47/blob/main/src/ts/api/pronouns.alejo.io.ts
async function get<T = JSON>(endpoint: string): Promise<T> {
    return await fetch("https://pronouns.alejo.io/api/" + endpoint).then(async (res: Response) => {
        return res.json() as Promise<T>;
    })
}

export async function getPronounsAsKeyToDisplayMap(): Promise<Record<string, string>> {
    const p: Record<string, string> = {};

    try {
        const res: Pronoun[] = await get<Pronoun[]>("pronouns")
        res.forEach((pronoun: Pronoun) => {
            p[pronoun.name] = pronoun.display;
        });
        return p;
    } catch (e) {
        console.warn('Alejo pronouns: Request to get pronouns from Alejo failed. Using cached data.')
        backupPronounsData.forEach((pronoun: Pronoun) => {
            p[pronoun.name] = pronoun.display;
        });
        return p
    }
}

type PronounValue = {
    value?: string
}
const userPronounsCache: Record<string, PronounValue> = {}

export type UserWithPronoun = {
    id: string;
    login: string;
    pronoun_id: string;
}

export async function getUserPronoun(username: string): Promise<string | undefined> {
    if (username.length < 1) {
        return;
    }

    const cachedPronoun = userPronounsCache[username]
    if (cachedPronoun) {
        return cachedPronoun.value
    }

    const res = await get<UserWithPronoun[]>("users/" + username);
    let match: UserWithPronoun | undefined = res.find((user: UserWithPronoun) => {
        return user.login.toLowerCase() === username.toLowerCase();
    })

    userPronounsCache[username] = {
        value: match ? match.pronoun_id : undefined
    }

    if (match !== undefined) {
        return match.pronoun_id;
    }
}

const backupPronounsData = [
    {
        "name": "aeaer",
        "display": "Ae/Aer"
    },
    {
        "name": "any",
        "display": "Any"
    },
    {
        "name": "eem",
        "display": "E/Em"
    },
    {
        "name": "faefaer",
        "display": "Fae/Faer"
    },
    {
        "name": "hehim",
        "display": "He/Him"
    },
    {
        "name": "heshe",
        "display": "He/She"
    },
    {
        "name": "hethem",
        "display": "He/They"
    },
    {
        "name": "itits",
        "display": "It/Its"
    },
    {
        "name": "other",
        "display": "Other"
    },
    {
        "name": "perper",
        "display": "Per/Per"
    },
    {
        "name": "sheher",
        "display": "She/Her"
    },
    {
        "name": "shethem",
        "display": "She/They"
    },
    {
        "name": "theythem",
        "display": "They/Them"
    },
    {
        "name": "vever",
        "display": "Ve/Ver"
    },
    {
        "name": "xexem",
        "display": "Xe/Xem"
    },
    {
        "name": "ziehir",
        "display": "Zie/Hir"
    }
]
