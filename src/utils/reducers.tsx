export enum FormEnum {
    Set = "SET_FORM",
    Delete = "DELETE_FORM_ENTRY",
}

type ActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
        ? {
              type: Key;
          }
        : {
              type: Key;
              payload: M[Key];
          };
};

export type LeagueFormType = {
    Name: string;
    FoundationYear: string;
    MaxFranchises: number | null;
    MaxProspects: number | null;
    DraftRightsGoalie: number | null;
    DraftRightsSkater: number | null;
    DraftRounds: number | null;
    AdminID: string;
    Admin: string;
    CommissionerID: string;
    Commissioner: string;
};

export type FranchiseFormType = {
    Name: string;
    OwnerId: string;
    OwnerName: string;
    FoundationYear: string;
    LeagueID: string;
};

export type SignupType = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
};

export type SigninType = {
    email: string;
    password: string;
};

type FormPayload = {
    [FormEnum.Set]: {
        name: string;
        value: string | number;
    };
};

export interface FormState {}

export type FormActions = ActionMap<FormPayload>[keyof ActionMap<FormPayload>];

export default function formReducer<S extends FormState>(state: S, action: FormActions) {
    switch (action.type) {
        case FormEnum.Set:
            return {
                ...state,
                [action.payload.name]: action.payload.value,
            };
        default:
            return state;
    }
}
