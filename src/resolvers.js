import {allBooks, imageUrl, findBookByid, searchBook} from './book';
import {authorsByBookId} from './author';
import {allReviews, createReview} from './review';

const resolvers = {
    SearchBookResult:{
        imageUrl: (result, args)=>imageUrl(args.size,result.id)
    },
    Book:{
        imageUrl:(book,{size}) =>imageUrl(size,book.google_id),
        authors: (book,args,context) => {
            const {loaders}= context;
            const {findAuthorsByBookIdsLoader} = loaders;
            return findAuthorsByBookIdsLoader.load(book.id);
            // authorsByBookId(book.id)
        },
        reviews: (book, args, context)=>{
            const { loaders } = context;
            const {findReviewsByBookIdsLoader} = loaders;
            return findReviewsByBookIdsLoader.load(book.id);
        }
    },
    Review:{
        book:(review,args,context)=> {
            const {loaders} = context;
            const {findBooksByIdsLoader} = loaders;
            return findBooksByIdsLoader.load(review.book_id);
            // findBookByid(review.book_id)
        } ,
        user:(review,args,context)=>{
            const {loaders} = context;
            const {findUserByIdsLoader} = loaders;
            return findUserByIdsLoader.load(review.user_id);
        }
    },
    Query:{
        books:(root,args)=>{
            return allBooks(args);
        },
        reviews:(root,args)=>{
            return allReviews(args);
        },
        book:(root,args,context)=>{
            const {loaders} = context;
            const {findBooksByIdsLoader} = loaders;
            return findBooksByIdsLoader.load(args.id);
        },
        searchBook:(root,args)=>{
            const {query} = args;
            return searchBook(query);
        }
    },
    Mutation:{
        createReview: (root,args) => {
            const {reviewInput} = args;
            return createReview(reviewInput);
        }
    }
};

export default resolvers;