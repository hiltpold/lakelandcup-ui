import { FranchiseFormType, LeagueFormType } from "./reducers";
import { DraftFormType } from "../routes/draft";
type FormType = FranchiseFormType | LeagueFormType | DraftFormType;

const formValidator = (form: FormType) => {
    for (let key in form) {
        const val = form[key as keyof FormType];
        if (val == "" || val === null || val === undefined) {
            return false;
        }
    }
    return true;
};

export default formValidator;
