import query from "./db";
import { groupBy, map } from "ramda";
import DataLoader from "dataloader";

export async function findUserByIds(ids){
    const sql = `
    SELECT*FROM hb.user
    WHERE hb.user.id = ANY($1);
    `;
    const params = [ids];

    try{
        const resullt = await query (sql,params);
        const rowsById = groupBy ((user)=>user.id, resullt.rows);
        return map (id=>{
            const user = rowsById[id] ? rowsById[id][0] : null;
            return user;
     },ids);
    }catch(err){
        console.log (err);
        throw err;
    }
}

export function findUserByIdsLoader(){
    return new DataLoader(findUserByIds);
}