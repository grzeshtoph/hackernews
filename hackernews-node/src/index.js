const {GraphQLServer} = require('graphql-yoga');
const {Prisma} = require('prisma-binding');

const resolvers = {
    Query: {
        info: () => 'This is the API of a Hackernews clone',
        feed: () => (root, args, context, info) => {
            return context.db.query.links({}, info)
        }
    },
    Mutation: {
        post: (root, args, context, info) => {
            return context.db.mutation.createLink({
                data: {
                    url: args.url,
                    description: args.description
                }
            }, info);
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
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: 'src/generated/prisma.graphql',
            endpoint: 'https://eu1.prisma.sh/public-grovecrest-823/hackernews-node/dev',
            secret: 'mysecret123',
            debug: true,
        })
    })
});

server.start(() => console.log('Server is running on http://localhost:4000'));