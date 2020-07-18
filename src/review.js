import query from './db';
import { groupBy,map } from 'ramda';
import DataLoader from 'dataloader';

const ORDER_BY = {
    ID_DESC: 'id desc',
    ID_ASC: 'id asc'
}

export async function allReviews(args){
    const orderBy = ORDER_BY[args.orderBy];
    const sql =  `
        SELECT*FROM hb.review
        ORDER BY ${orderBy}
    `
    try{
        const result = await query(sql);
        return result.rows;
    }catch(err) {
        console.log (err);
        throw err;
    }
}

async function findReviewsByBookIds(ids){
    const sql = `
    SELECT*FROM hb.review
    WHERE hb.review.book_id = ANY($1);
    `;
    const params = [ids];
    try{
        const result = await query (sql,params);
        const rowsById = groupBy((review)=>review.book_id, result.rows);
        return map ( id=>rowsById[id], ids)
    }catch(err){
        console.log (err);
        throw err;
    }
}

export function findReviewsByBookIdsLoader(){
    return new DataLoader(findReviewsByBookIds);
}

export async function createReview(reviewInput){
    const {book_id, email, name, rating, title,comment} = reviewInput;
    const sql = `
    SELECT*FROM hb.create_review($1, $2, $3, $4, $5, $6);
    `;
    const params = [book_id,email,name,rating,title,comment];
    try{
        const result = await query (sql,params);
        return result.rows[0];
    }catch(err){
        console.log(err);
        throw err;
    }
}