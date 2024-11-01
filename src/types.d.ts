// #region general
declare global {
    interface Window {
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
    repos: RepoList;
    clients: ClientList;
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
    onFirstConsent?: () => void;
    onChange?: () => void;
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
export interface RepoObject {
    name: string;
    type: string;
    url?: string;
}

export type RepoList = RepoObject[];

export interface RepoLink {
    title: string;
    icon: string;
    link?: string;
}

export interface RepoLinkConfig {
    [key: string]: RepoLink;
}
// #endregion

// #region clients
export interface ClientObject {
    title: string;
    url: string;
    img: {
        src: string;
        width: string;
        height: string;
    };
    classes: string;
}

export type ClientList = ClientObject[];
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
