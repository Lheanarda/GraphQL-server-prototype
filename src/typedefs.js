const typeDefs = `
schema{
    query:Query
    mutation: Mutation
}
type Query{
    books(orderBy: BookOrderBy = RATING_DESC) :[Book]
    reviews (orderBy: ReviewOrderBy=  ID_ASC) : [Review]
    book(id: ID!) : Book
    searchBook(query: String!): [SearchBookResult]
}

type SearchBookResult{
    id: ID!
    title: String!
    description: String!
    authors:  [String]
    imageUrl(size: ImageSize = LARGE):String
}

type Mutation{
    createReview(reviewInput: ReviewInput!): Review
}

input ReviewInput{
    book_id: ID!
    rating: String!
    name: String!
    email: String! 
    title: String!
    comment: String!
}

enum BookOrderBy{
    RATING_DESC
    ID_DESC
}

type Book{
    id:ID!
    title: String!
    subtitle: String
    rating_count:Int
    description: String!
    imageUrl(size: ImageSize = LARGE): String!
    rating: Float
    authors: [Author]
    reviews: [Review]
}

type Author{
    id:ID!
    name: String!
}

type Review{
    id: ID!
    rating : Int,
    title: String,
    comment: String,
    book: Book,
    user: User
}

enum ReviewOrderBy{
    ID_DESC
    ID_ASC
}

type User{
    id:ID!
    email: String
    name : String
    tokens: String
}

enum ImageSize{
    SMALL
    LARGE
}
`;

export default typeDefs;