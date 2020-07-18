import query from './db';
import {groupBy, map} from 'ramda';
import DataLoader from 'dataloader';

export async function findAuthorsByBookIds(ids){
    const sql = `
    SELECT hb.author.* , hb.book_author.book_id
    FROM hb.author INNER JOIN hb.book_author
    on hb.author.id = hb.book_author.author_id
    WHERE hb.book_author.book_id = ANY($1) ;`;

    const params = [ids];
    try{
        const result = await query (sql,params);
        const rowsById = groupBy(author=>author.book_id, result.rows);
        return map (id => rowsById[id] , ids);
    }catch (err) {
        console.log(err);
        throw err;
    }
}

export function findAuthorsByBookIdsLoader(){
    return new DataLoader(findAuthorsByBookIds);
}

export async function authorsByBookId(id){
    const sql = `
    SELECT hb.author.* FROM hb.author INNER JOIN hb.book_author
    on hb.author.id = hb.book_author.author_id
    WHERE hb.book_author.book_id = $1;`;

    const params = [id];
    try{
        const result = await query(sql,params);
        return result.rows;
    }catch(err){
        console.log(err);
        throw err;
    }
}