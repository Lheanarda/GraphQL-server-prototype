import{findAuthorsByBookIdsLoader} from './author';
import { findBooksByIdsLoader} from './book';
import { findUserByIdsLoader } from './user';
import { findReviewsByBookIdsLoader } from './review';

export  default()=>({
    findAuthorsByBookIdsLoader: findAuthorsByBookIdsLoader(),
    findBooksByIdsLoader: findBooksByIdsLoader(),
    findUserByIdsLoader:findUserByIdsLoader(),
    findReviewsByBookIdsLoader: findReviewsByBookIdsLoader()
})