import { FranchiseFormType, LeagueFormType } from "./reducers";
import { DraftFormType } from "../routes/draft";
import { DraftLottery } from "../routes/league";
type FormType = FranchiseFormType | LeagueFormType | DraftFormType | DraftLottery;

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
