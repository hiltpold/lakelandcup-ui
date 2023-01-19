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

export type LeagueTypeForm = {
    name: string;
    foundationYear: string;
    maxFranchises: bigint | null;
    maxProspects: bigint | null;
    draftRightsGoalie: bigint | null;
    draftRightsSkater: bigint | null;
    adminID: string;
    admin: string;
    commissionerID: string;
    commissioner: string;
};

export type FranchiseType = {
    name: string;
    ownerId: string;
    ownerName: string;
    foundationYear: string;
    leagueID: string;
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
        value: string;
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
