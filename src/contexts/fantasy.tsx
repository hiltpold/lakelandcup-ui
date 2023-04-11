import { FunctionalComponent, createContext, h } from "preact";
import { useState, StateUpdater, useReducer } from "preact/hooks";
import { ids } from "webpack";

export interface IFantasy {
    userId: string;
    leagueId: string;
    franchiseId: string;
    leagueIds: string[];
}

export const initialLeague = {
    id: "",
    name: "",
    foundationYear: "",
    maxFranchises: "",
    commissioner: "",
    deputyCommissioner: "",
};

export interface ILeague {
    id: string;
    name: string;
    foundationYear: string;
    commissioner: string;
    deputyCommissioner: string;
}

export interface IFranchise {
    id: string;
    name: string;
    owner: string;
    league: ILeague;
}

export interface ILeagueContext {
    leagueState: ILeague;
    setLeagueState: StateUpdater<ILeague>;
}
export interface IFranchiseContext {
    franchiseState: IFranchise;
    setFranchiseState: StateUpdater<IFranchise>;
}

export const LeagueContext = createContext({} as ILeagueContext);
export const FranchiseContext = createContext({} as IFranchiseContext);

//export leagueReducer = (state, action)

const FantasyContext: FunctionalComponent = ({ children }) => {
    const [leagueState, setLeagueState] = useState<ILeague>(initialLeague);
    /*
    <FranchiseContext.Provider value={{ franchiseState, setFranchiseState }}>
        {children}
    </FranchiseContext.Provider>
    */
    return (
        <LeagueContext.Provider value={{ leagueState, setLeagueState }}>
            {children}
        </LeagueContext.Provider>
    );
};
export default FantasyContext;
