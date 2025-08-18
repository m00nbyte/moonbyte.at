// #region general
declare global {
    interface Window {
        PowerGlitch: {
            glitch: (classname, options?) => void;
        };
        animatedStarField: (StarsConfig) => void;
        dataLayer: Array<Record<unknown, unknown>>;
        gtag: (...arguments) => void;
    }
}

interface MainConfig {
    consent: ConsentText;
    stars: StarsConfig;
    stack: TechStackList;
    services: ServiceList;
    github: {
        user: string;
        repos: string[];
    };
    clients: ClientList;
    testimonials: TestimonialList;
    form: FormText;
}
// #endregion

// #region consent
export interface ConsentTranslation {
    consentModal: {
        title: string;
        description: string;
        acceptAllBtn: string;
        acceptNecessaryBtn: string;
        showPreferencesBtn: string;
        footer?: string;
    };
    preferencesModal: {
        title: string;
        acceptAllBtn: string;
        acceptNecessaryBtn: string;
        savePreferencesBtn: string;
        closeIconLabel: string;
        serviceCounterLabel: string;
        sections: {
            title: string;
            description: string;
            linkedCategory?: string;
        }[];
    };
}

export interface ConsentText {
    default: string;
    translations: {
        en: ConsentTranslation;
    };
}

export interface ConsentCategory {
    services?: {
        [key: string]: {
            label: string;
            onAccept: () => void;
            onReject: () => void;
            cookies: {
                name: RegExp | string;
            }[];
        };
    };
}

export interface ConsentGUI {
    layout: string;
    position: string;
    equalWeightButtons: boolean;
    flipButtons: boolean;
}

export interface ConsentOptions {
    revision?: number;
    autoShow?: boolean;
    disablePageInteraction?: boolean;
    guiOptions?: {
        consentModal: ConsentGUI;
        preferencesModal: ConsentGUI;
    };
    categories?: {
        necessary: {
            readOnly: boolean;
        };
        functionality?: ConsentCategory;
        analytics?: ConsentCategory;
        marketing?: ConsentCategory;
    };
    language: ConsentText;
}
// #endregion

// #region tech stack
export interface TechStackObject {
    title: string;
    icon: string;
}

export type TechStackList = TechStackObject[];
// #endregion

// #region services
export interface ServiceObject {
    icon: string;
    title: string;
    description: string;
}

export type ServiceList = ServiceObject[];
// #endregion

// #region repos
export interface GitHubRepo {
    name: string;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    fork: boolean;
}

export type GitHubRepoList = GitHubRepo[];
// #endregion

// #region clients
export interface ClientObject {
    title: string;
    url: string;
    src: string;
    classes: string;
}

export type ClientList = ClientObject[];
// #endregion

// #region testimonials
export interface TestimonialObject {
    rating: number;
    name: string;
    text: string;
}

export type TestimonialList = TestimonialObject[];
// #endregion

// #region form
export interface FormResponse {
    title: string;
    message: string;
    color: string;
}

export interface FormText {
    formId: string;
    required: string;
    minLength: string;
    maxLength: string;
    messageLimit: string;
    invalidChars: string;
    invalidEmail: string;
    checkbox: string;
    response: {
        [key: number]: FormResponse;
    };
    [key: string]: string | object;
}
// #endregion
