import query from './db';
import { groupBy,map, pathOr } from 'ramda';
import DataLoader from 'dataloader';
import axios from 'axios';


export async function searchBook(query){
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
    try{
        const result = await axios(url);
        const items = pathOr([],['data','items'],result);
        const books = map(book=>({id:book.id, ...book.volumeInfo}),items);
        return books;
    }catch(err){
        console.log (err);
        throw err;
    }
}

export async function findBooksByIds(ids){
    const sql= `
    SELECT*FROM hb.book
    WHERE hb.book.id = ANY($1);
    `;

    const params = [ids];
    try{
        const result = await query(sql,params);
        const rowsById = groupBy((book)=> book.id , result.rows);
        return map ( id =>{
            const book = rowsById[id] ? rowsById[id][0] : null;
            return book;
        }, ids);
    }catch (err){
        console.log (err);
        throw err;
    }
}

export function findBooksByIdsLoader(){
    return new DataLoader(findBooksByIds);
}

export async function findBookByid(id){
    const sql = `
    SELECT* FROM hb.book
    WHERE hb.book.id = $1;
    `
    const params = [id];
    try{
        const result = await query(sql,params);
        return result.rows[0];
    }catch(err){
        console.log (err);
        throw err;
    }
}

const ORDER_BY= {
    ID_DESC: 'id desc',
    RATING_DESC: 'rating desc'
}
export async function allBooks(args){
    const orderBy  = ORDER_BY[args.orderBy];
    const sql =  `
        SELECT*FROM hb.book
        ORDER BY ${orderBy};
    `;
    try{
        const result =await query(sql);
        return result.rows;
    }catch(err){
        console.log(err);
        throw err;
    }
}

// export async function singleBook (args){
//     const sql = `
//     SELECT*FROM hb.book
//     WHERE id = ${args};
//     `
//     try{
//         const result = await query(sql);
//         return result.rows;
//     }catch(err){
//         console.log(err);
//         throw err;
//     }
// }

export function imageUrl(size,id){
    const zoom = size ==='SMALL' ? 1 : 0;
    return `//books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=${size}&edge=curl&source=gbs_api`;
}