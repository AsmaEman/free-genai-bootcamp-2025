import { ObjectType, Field } from 'type-graphql';
import { WordProgress } from './WordProgress';

@ObjectType()
export class Word {
  @Field()
  id?: string;

  @Field()
  arabicText?: string;

  @Field({ nullable: true })
  diacritics?: string;

  @Field()
  englishTranslation?: string;

  @Field(() => [String])
  examples?: string[];

  @Field({ nullable: true })
  audioUrl?: string;

  @Field(() => [String])
  tags?: string[];

  @Field(() => Object)
  metadata?: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    usage: string[];
  };

  @Field(() => [String], { nullable: true })
  relatedWords?: string[];

  @Field(() => [WordProgress], { nullable: true })
  progress?: WordProgress[];

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}
