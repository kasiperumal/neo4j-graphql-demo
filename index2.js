import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

const typeDefs = `#graphql
type APS @node(labels: ["APS", "Component"]) {
	componentsSendsRequestTo: [Component!]! @relationship(type: "SENDS_REQUEST_TO", direction: IN, properties: "SendsRequestToProperties")
	sendsResponseToComponents: [Component!]! @relationship(type: "SENDS_RESPONSE_TO", direction: OUT, properties: "SendsResponseToProperties")
	session_id: String!
	sessionsHasComponent: [Session!]! @relationship(type: "HAS_COMPONENT", direction: IN)
	title: String!
}

type AuthC @node(labels: ["AuthC", "SubComponent"]) {
	component: String!
	component3SHasSubcomponent: [Component3!]! @relationship(type: "HAS_SUBCOMPONENT", direction: IN)
	recommended_action: String!
	sccssendsResponseTo: [SCC!]! @relationship(type: "SENDS_RESPONSE_TO", direction: IN, properties: "SendsResponseToProperties")
	sdissendsResponseTo: [SDI!]! @relationship(type: "SENDS_RESPONSE_TO", direction: IN, properties: "SendsResponseToProperties")
	sendsRequestTosccs: [SCC!]! @relationship(type: "SENDS_REQUEST_TO", direction: OUT, properties: "SendsRequestToProperties")
	sendsRequestTosdis: [SDI!]! @relationship(type: "SENDS_REQUEST_TO", direction: OUT, properties: "SendsRequestToProperties")
	sendsRequestTosps: [SPS!]! @relationship(type: "SENDS_REQUEST_TO", direction: OUT, properties: "SendsRequestToProperties")
	session_id: String!
	spssendsResponseTo: [SPS!]! @relationship(type: "SENDS_RESPONSE_TO", direction: IN, properties: "SendsResponseToProperties")
	title: String!
}

type Component @node(labels: ["Component", "LoginApp"]) {
	apssendsResponseTo: [APS!]! @relationship(type: "SENDS_RESPONSE_TO", direction: IN, properties: "SendsResponseToProperties")
	component2SSendsResponseTo: [Component2!]! @relationship(type: "SENDS_RESPONSE_TO", direction: IN, properties: "SendsResponseToProperties")
	component3SSendsResponseTo: [Component3!]! @relationship(type: "SENDS_RESPONSE_TO", direction: IN, properties: "SendsResponseToProperties")
	device: String!
	deviceType: String
	error_category: String!
	error_reason: String!
	event_name: String!
	event_status: String!
	interdiction_result: String!
	pre_auth_identifier: String!
	pre_auth_status: String!
	sendsRequestToComponent2S: [Component2!]! @relationship(type: "SENDS_REQUEST_TO", direction: OUT, properties: "SendsRequestToProperties")
	sendsRequestToComponent3S: [Component3!]! @relationship(type: "SENDS_REQUEST_TO", direction: OUT, properties: "SendsRequestToProperties")
	sendsRequestToaps: [APS!]! @relationship(type: "SENDS_REQUEST_TO", direction: OUT, properties: "SendsRequestToProperties")
	session_id: String!
	sessionsHasComponent: [Session!]! @relationship(type: "HAS_COMPONENT", direction: IN)
	title: String!
}

type Component2 @node(labels: ["Component", "LDAP"]) {
	componentsSendsRequestTo: [Component!]! @relationship(type: "SENDS_REQUEST_TO", direction: IN, properties: "SendsRequestToProperties")
	sendsResponseToComponents: [Component!]! @relationship(type: "SENDS_RESPONSE_TO", direction: OUT, properties: "SendsResponseToProperties")
	session_id: String!
	sessionsHasComponent: [Session!]! @relationship(type: "HAS_COMPONENT", direction: IN)
	title: String!
}

type Component3 @node(labels: ["Component", "SIMS"]) {
	componentsSendsRequestTo: [Component!]! @relationship(type: "SENDS_REQUEST_TO", direction: IN, properties: "SendsRequestToProperties")
	hasSubcomponentAuthCs: [AuthC!]! @relationship(type: "HAS_SUBCOMPONENT", direction: OUT)
	hasSubcomponentsccs: [SCC!]! @relationship(type: "HAS_SUBCOMPONENT", direction: OUT)
	hasSubcomponentsdis: [SDI!]! @relationship(type: "HAS_SUBCOMPONENT", direction: OUT)
	hasSubcomponentsps: [SPS!]! @relationship(type: "HAS_SUBCOMPONENT", direction: OUT)
	sendsResponseToComponents: [Component!]! @relationship(type: "SENDS_RESPONSE_TO", direction: OUT, properties: "SendsResponseToProperties")
	session_id: String!
	sessionsHasComponent: [Session!]! @relationship(type: "HAS_COMPONENT", direction: IN)
	title: String!
	recommended_action: String!
}

type Customer {
	ecn: String!
	hasSessionSessions: [Session!]! @relationship(type: "HAS_SESSION", direction: OUT)
	title: String!
}

type SCC @node(labels: ["SCC", "SubComponent"]) {
	authCssendsRequestTo: [AuthC!]! @relationship(type: "SENDS_REQUEST_TO", direction: IN, properties: "SendsRequestToProperties")
	ceea_preference: String!
	component: String!
	component3SHasSubcomponent: [Component3!]! @relationship(type: "HAS_SUBCOMPONENT", direction: IN)
	password_status: String!
	sendsResponseToAuthCs: [AuthC!]! @relationship(type: "SENDS_RESPONSE_TO", direction: OUT, properties: "SendsResponseToProperties")
	session_id: String!
	title: String!
}

type SDI @node(labels: ["SDI", "SubComponent"]) {
	authCssendsRequestTo: [AuthC!]! @relationship(type: "SENDS_REQUEST_TO", direction: IN, properties: "SendsRequestToProperties")
	component: String!
	component3SHasSubcomponent: [Component3!]! @relationship(type: "HAS_SUBCOMPONENT", direction: IN)
	device_bound: Boolean!
	device_bound_method: String!
	device_id: String!
	device_id_status: String!
	device_linked: Boolean!
	device_linked_method: String!
	device_tag: String!
	sendsResponseToAuthCs: [AuthC!]! @relationship(type: "SENDS_RESPONSE_TO", direction: OUT, properties: "SendsResponseToProperties")
	session_id: String!
	title: String!
}

type SPS @node(labels: ["SPS", "SubComponent"]) {
	authCssendsRequestTo: [AuthC!]! @relationship(type: "SENDS_REQUEST_TO", direction: IN, properties: "SendsRequestToProperties")
	component: String!
	component3SHasSubcomponent: [Component3!]! @relationship(type: "HAS_SUBCOMPONENT", direction: IN)
	control_point: String!
	recommended_action: String!
	risk_rule_list: [String]!
	sendsResponseToAuthCs: [AuthC!]! @relationship(type: "SENDS_RESPONSE_TO", direction: OUT, properties: "SendsResponseToProperties")
	session_id: String!
	title: String!
}

interface SendsRequestToProperties @relationshipProperties {
	api_name: String!
	msg: String!
	source_component: String
	source_subcomponent: String
	target_component: String
	target_subcomponent: String
}

interface SendsResponseToProperties @relationshipProperties {
	api_name: String!
	msg: String!
	source_component: String
	source_subcomponent: String
	target_component: String
	target_subcomponent: String
}

type Session {
	customersHasSession: [Customer!]! @relationship(type: "HAS_SESSION", direction: IN)
	hasComponentComponent2S: [Component2!]! @relationship(type: "HAS_COMPONENT", direction: OUT)
	hasComponentComponent3S: [Component3!]! @relationship(type: "HAS_COMPONENT", direction: OUT)
	hasComponentComponents: [Component!]! @relationship(type: "HAS_COMPONENT", direction: OUT)
	hasComponentaps: [APS!]! @relationship(type: "HAS_COMPONENT", direction: OUT)
	session_id: String!
	status: String!
	timestamp: DateTime!
	title: String!
}
`;

const driver = neo4j.driver(
    "bolt://127.0.0.1:7687",
    neo4j.auth.basic("neo4j", "admin123")
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
});

const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
        // Log the headers and body of the request to the console
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Body:', JSON.stringify(req.body, null, 2));
        
        // Return the req object so it can be used in your resolvers
        return { req };
    },
    listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);
