import { ObjectType, Field } from 'type-graphql';
import { GraphQLScalarType, Kind } from 'graphql';
import { User } from './User';
import { WordProgress } from './WordProgress';

// Define a custom scalar for JSON
const GraphQLJSON = new GraphQLScalarType({
  name: 'JSON',
  description: 'The `JSON` scalar type represents JSON values.',
  parseValue(value) {
    return value; // value from the client input variables
  },
  serialize(value) {
    return value; // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value); // ast value is always in string format
    }
    return null;
  },
});

@ObjectType()
class SessionData {
  [key: string]: any; // Add index signature

  @Field()
  duration!: number;

  @Field(() => [String])
  wordsStudied!: string[];

  @Field()
  correctAnswers!: number;

  @Field()
  incorrectAnswers!: number;
}

@ObjectType()
export class StudySession {
  @Field()
  id!: string;

  @Field()
  userId!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  status!: string;

  @Field(() => SessionData)
  sessionData!: SessionData;

  @Field(() => GraphQLJSON)
  performance!: any; // Use 'any' to allow any JSON structure

  constructor(
    id: string,
    userId: string,
    createdAt: Date,
    updatedAt: Date,
    status: string,
    sessionData: SessionData,
    performance: any
  ) {
    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    this.sessionData = sessionData;
    this.performance = performance;
  }
}
