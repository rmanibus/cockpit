import React from 'react';
import { useRouter } from 'next/router';
import yaml from 'js-yaml';
import api from '../api';
import { DockerStack } from '../types/DockerStack';
import { DataContext, DataContextValue } from './DataContext';
import { merge, omit, unset } from 'lodash';

export interface StackContextValue {
    stack : DockerStack;
    stackId: string;
    serviceId: string;
    update: any;
}

export const StackContext = React.createContext<StackContextValue>(null);
interface StackContextProviderProps {
    children: React.ReactNode;
}

export type Resource = {
    context: string;
    id?: string;
}
export const StackContextProvider: React.FC<StackContextProviderProps> = ({ children }: StackContextProviderProps) => {
    const router = useRouter();
    const { stackId, serviceId } = router.query;
    const [stack, setStack] = React.useState<DockerStack | null>(null);
    const [changeSet, setChangeSet] = React.useState({});

    const { setPath } = React.useContext<DataContextValue>(DataContext);

    React.useEffect(() => {
        if(stackId){
            setPath({context:'stacks', id: stackId});
            refresh();
        } else {
            clear();
        }
    }, [stackId]);

    const baseupdate = (added, removed = {}) => {
        setChangeSet({...merge(changeSet, {added: added, removed: removed})});
        setStack(omit({...merge(stack, added)}, getLeaves(removed)));
    };

    var getLeaves = function(tree) : Array<string> {
        var leaves = [];
        var walk = function(obj,path = ""){
            for(var n in obj){
                if (obj.hasOwnProperty(n)) {
                    if(obj[n] !== null && (typeof obj[n] === "object" || obj[n] instanceof Array)) {
                        walk(obj[n],path + "." + n);
                    } else {
                        leaves.push((path + "." + n).substring(1));
                    }
                }
            }
        }
        walk(tree);
        return leaves;
    }

    const update = (item) => (added, removed) => {
        baseupdate({[item]: added}, removed && {[item]: removed})
    };

    const refresh = () => {
        if(!stackId){
            return Promise.reject("path not set");
        }
        setChangeSet({});
        return api.get('stacks/' + stackId + '/compose').then((res) => {
          try {
            const parsed = yaml.load(res.data);
            setStack(parsed);
          } catch (e) {
            console.log(e);
          }
        });
    }
    const clear = () => {
        setChangeSet({});
        setStack(null);
    }
    return (
        <StackContext.Provider
          value={{
            update,
            stackId,
            serviceId,
            stack
          }}
        >
          {children}
        </StackContext.Provider>
    );
}