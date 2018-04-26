const {GraphQLServer} = require('graphql-yoga');

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}];
let idCount = links.length;

// 2
const resolvers = {
    Query: {
        info: () => 'This is the API of a Hackernews clone',
        feed: () => links
    },
    Mutation: {
        post: (root, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url
            };
            links.push(link);
            return link;
        },
        updateLink: (root, args) => {
            for (let i = 0; i < links.length; i++) {
                const link = links[i];
                if (link.id === args.id) {
                    link.description = args.description;
                    link.url = args.url;
                    return link;
                }
            }
            return null;
        },
        deleteLink: (root, args) => {
            for (let i = 0; i < links.length; i++) {
                const link = links[i];
                if (link.id === args.id) {
                    links.splice(i, 1);
                    return link;
                }
            }
            return null;
        }
    }
};

// 3
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
});

server.start(() => console.log('Server is running on http://localhost:4000'));