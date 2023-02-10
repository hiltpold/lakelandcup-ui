import { FranchiseFormType, LeagueFormType } from "./reducers";

type FormType = FranchiseFormType | LeagueFormType;

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
/*
formData.LeagueID !== "" &&
    formData.Name !== "" &&
    formData.FoundationYear !== "" &&
    formData.OwnerName !== "" &&
    formData.OwnerId !== "";
export default formValidator;
*/
