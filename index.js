import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

const typeDefs = `#graphql
type AccountManager @node(labels: ["AccountManager", "Component"]) {
	componentsSendsRequestTo: [Component!]!
	  @relationship(
		type: "SENDS_REQUEST_TO"
		direction: IN
		properties: "SendsRequestToProperties"
	  )
	sendsResponseToComponents: [Component!]!
	  @relationship(
		type: "SENDS_RESPONSE_TO"
		direction: OUT
		properties: "SendsResponseToProperties"
	  )
	session_id: String!
	sessionsHasComponent: [Session!]!
	  @relationship(type: "HAS_COMPONENT", direction: IN)
	title: String!
  }
  
  type ActiveDirectory @node(labels: ["ActiveDirectory", "Component"]) {
	componentsSendsRequestTo: [Component!]!
	  @relationship(
		type: "SENDS_REQUEST_TO"
		direction: IN
		properties: "SendsRequestToProperties"
	  )
	sendsResponseToComponents: [Component!]!
	  @relationship(
		type: "SENDS_RESPONSE_TO"
		direction: OUT
		properties: "SendsResponseToProperties"
	  )
	session_id: String!
	sessionsHasComponent: [Session!]!
	  @relationship(type: "HAS_COMPONENT", direction: IN)
	title: String!
  }
  
  type Component @node(labels: ["Component", "LoginComponent"]) {
	accountManagersSendsResponseTo: [AccountManager!]!
	  @relationship(
		type: "SENDS_RESPONSE_TO"
		direction: IN
		properties: "SendsResponseToProperties"
	  )
	activeDirectoriesSendsResponseTo: [ActiveDirectory!]!
	  @relationship(
		type: "SENDS_RESPONSE_TO"
		direction: IN
		properties: "SendsResponseToProperties"
	  )
	component2SSendsResponseTo: [Component2!]!
	  @relationship(
		type: "SENDS_RESPONSE_TO"
		direction: IN
		properties: "SendsResponseToProperties"
	  )
	device: String!
	deviceType: String
	error_category: String!
	error_reason: String!
	event_name: String!
	event_status: String!
	interdiction_result: String!
	pre_auth_identifier: String!
	pre_auth_status: String!
	sendsRequestToAccountManagers: [AccountManager!]!
	  @relationship(
		type: "SENDS_REQUEST_TO"
		direction: OUT
		properties: "SendsRequestToProperties"
	  )
	sendsRequestToActiveDirectories: [ActiveDirectory!]!
	  @relationship(
		type: "SENDS_REQUEST_TO"
		direction: OUT
		properties: "SendsRequestToProperties"
	  )
	sendsRequestToComponent2S: [Component2!]!
	  @relationship(
		type: "SENDS_REQUEST_TO"
		direction: OUT
		properties: "SendsRequestToProperties"
	  )
	session_id: String!
	sessionsHasComponent: [Session!]!
	  @relationship(type: "HAS_COMPONENT", direction: IN)
	title: String!
  }
  
  type Component2 @node(labels: ["Component", "IdentityManager"]) {
	componentsSendsRequestTo: [Component!]!
	  @relationship(
		type: "SENDS_REQUEST_TO"
		direction: IN
		properties: "SendsRequestToProperties"
	  )
	hasSubcomponentCredentialServices: [CredentialService!]!
	  @relationship(type: "HAS_SUBCOMPONENT", direction: OUT)
	hasSubcomponentDecisionServices: [DecisionService!]!
	  @relationship(type: "HAS_SUBCOMPONENT", direction: OUT)
	hasSubcomponentDeviceServices: [DeviceService!]!
	  @relationship(type: "HAS_SUBCOMPONENT", direction: OUT)
	hasSubcomponentIdentityOrchestrators: [IdentityOrchestrator!]!
	  @relationship(type: "HAS_SUBCOMPONENT", direction: OUT)
	recommended_action: String!
	sendsResponseToComponents: [Component!]!
	  @relationship(
		type: "SENDS_RESPONSE_TO"
		direction: OUT
		properties: "SendsResponseToProperties"
	  )
	session_id: String!
	sessionsHasComponent: [Session!]!
	  @relationship(type: "HAS_COMPONENT", direction: IN)
	title: String!
  }
  
  type CredentialService @node(labels: ["CredentialService", "SubComponent"]) {
	ceea_preference: String!
	component: String!
	component2SHasSubcomponent: [Component2!]!
	  @relationship(type: "HAS_SUBCOMPONENT", direction: IN)
	identityOrchestratorsSendsRequestTo: [IdentityOrchestrator!]!
	  @relationship(
		type: "SENDS_REQUEST_TO"
		direction: IN
		properties: "SendsRequestToProperties"
	  )
	password_status: String!
	sendsResponseToIdentityOrchestrators: [IdentityOrchestrator!]!
	  @relationship(
		type: "SENDS_RESPONSE_TO"
		direction: OUT
		properties: "SendsResponseToProperties"
	  )
	session_id: String!
	title: String!
  }
  
  type Customer {
	ecn: String!
	hasSessionSessions: [Session!]!
	  @relationship(type: "HAS_SESSION", direction: OUT)
	title: String!
  }
  
  type DecisionService @node(labels: ["DecisionService", "SubComponent"]) {
	component: String!
	component2SHasSubcomponent: [Component2!]!
	  @relationship(type: "HAS_SUBCOMPONENT", direction: IN)
	control_point: String!
	identityOrchestratorsSendsRequestTo: [IdentityOrchestrator!]!
	  @relationship(
		type: "SENDS_REQUEST_TO"
		direction: IN
		properties: "SendsRequestToProperties"
	  )
	recommended_action: String!
	risk_rule_list: [String]!
	sendsResponseToIdentityOrchestrators: [IdentityOrchestrator!]!
	  @relationship(
		type: "SENDS_RESPONSE_TO"
		direction: OUT
		properties: "SendsResponseToProperties"
	  )
	session_id: String!
	title: String!
  }
  
  type DeviceService @node(labels: ["DeviceService", "SubComponent"]) {
	component: String!
	component2SHasSubcomponent: [Component2!]!
	  @relationship(type: "HAS_SUBCOMPONENT", direction: IN)
	device_bound: Boolean!
	device_bound_method: String!
	device_id: String!
	device_id_status: String!
	device_linked: Boolean!
	device_linked_method: String!
	device_tag: String!
	identityOrchestratorsSendsRequestTo: [IdentityOrchestrator!]!
	  @relationship(
		type: "SENDS_REQUEST_TO"
		direction: IN
		properties: "SendsRequestToProperties"
	  )
	sendsResponseToIdentityOrchestrators: [IdentityOrchestrator!]!
	  @relationship(
		type: "SENDS_RESPONSE_TO"
		direction: OUT
		properties: "SendsResponseToProperties"
	  )
	session_id: String!
	title: String!
  }
  
  type IdentityOrchestrator
	@node(labels: ["IdentityOrchestrator", "SubComponent"]) {
	component: String!
	component2SHasSubcomponent: [Component2!]!
	  @relationship(type: "HAS_SUBCOMPONENT", direction: IN)
	credentialServicesSendsResponseTo: [CredentialService!]!
	  @relationship(
		type: "SENDS_RESPONSE_TO"
		direction: IN
		properties: "SendsResponseToProperties"
	  )
	decisionServicesSendsResponseTo: [DecisionService!]!
	  @relationship(
		type: "SENDS_RESPONSE_TO"
		direction: IN
		properties: "SendsResponseToProperties"
	  )
	deviceServicesSendsResponseTo: [DeviceService!]!
	  @relationship(
		type: "SENDS_RESPONSE_TO"
		direction: IN
		properties: "SendsResponseToProperties"
	  )
	recommended_action: String!
	sendsRequestToCredentialServices: [CredentialService!]!
	  @relationship(
		type: "SENDS_REQUEST_TO"
		direction: OUT
		properties: "SendsRequestToProperties"
	  )
	sendsRequestToDecisionServices: [DecisionService!]!
	  @relationship(
		type: "SENDS_REQUEST_TO"
		direction: OUT
		properties: "SendsRequestToProperties"
	  )
	sendsRequestToDeviceServices: [DeviceService!]!
	  @relationship(
		type: "SENDS_REQUEST_TO"
		direction: OUT
		properties: "SendsRequestToProperties"
	  )
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
	customersHasSession: [Customer!]!
	  @relationship(type: "HAS_SESSION", direction: IN)
	hasComponentAccountManagers: [AccountManager!]!
	  @relationship(type: "HAS_COMPONENT", direction: OUT)
	hasComponentActiveDirectories: [ActiveDirectory!]!
	  @relationship(type: "HAS_COMPONENT", direction: OUT)
	hasComponentComponent2S: [Component2!]!
	  @relationship(type: "HAS_COMPONENT", direction: OUT)
	hasComponentComponents: [Component!]!
	  @relationship(type: "HAS_COMPONENT", direction: OUT)
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

// const server = new ApolloServer({
//     schema: await neoSchema.getSchema(),
// });
// Apollo Server plugin for logging responses
const loggingPlugin = {
    async requestDidStart() {
        return {
            async willSendResponse(requestContext) {
                console.log('Response:', JSON.stringify(requestContext.response, null, 2));
            },
        };
    },
};

const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
    plugins: [loggingPlugin], // Add the logging plugin here
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