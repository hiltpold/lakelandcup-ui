import { FunctionalComponent, createContext, h } from 'preact';
import { useState, StateUpdater } from 'preact/hooks';

export interface ILeague {
    id: string;
    name: string;
    creator: string;
    commissioner: string;
}

export interface IFranchise{
    id: string;
    name: string;
    owner: string;
    league: ILeague;
}

export interface ILeagueContext {
    leagueState: ILeague;
    setLeagueState: StateUpdater<ILeague> 
}
export interface IFranchiseContext {
    franchiseState: IFranchise;
    setFranchiseState: StateUpdater<IFranchise> 
}

export const LeagueContext = createContext({} as ILeagueContext)
export const FranchiseContext = createContext({} as IFranchiseContext)

const Fantasy: FunctionalComponent = ({ children }) => {
    const initialLeague = {
        id: "",
        name: "",
        creator: "",
        commissioner:""
    }
    const initialFranchise = {
        id: "",
        name: "",
        owner: "",
        league: initialLeague
    }

    const [leagueState, setLeagueState] = useState<ILeague>(initialLeague);
    const [franchiseState, setFranchiseState] = useState<IFranchise>(initialFranchise);

    return(
        <LeagueContext.Provider value={{leagueState, setLeagueState}}>
            <FranchiseContext.Provider value ={{franchiseState, setFranchiseState}}>
                {children}
            </FranchiseContext.Provider>
        </LeagueContext.Provider>
    );

}; 
export default Fantasy;