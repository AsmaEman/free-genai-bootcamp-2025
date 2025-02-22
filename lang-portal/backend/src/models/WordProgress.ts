import { ObjectType, Field } from 'type-graphql';

@ObjectType()
class ReviewHistoryEntry {
  @Field()
  date!: Date;

  @Field()
  correct!: boolean;

  @Field()
  responseTime!: number;
}

@ObjectType()
export class WordProgress {
  @Field()
  id!: string;

  @Field()
  userId!: string;

  @Field()
  wordId!: string;

  @Field()
  masteryLevel!: number;

  @Field()
  timesReviewed!: number;

  @Field(() => [ReviewHistoryEntry])
  reviewHistory!: ReviewHistoryEntry[];

  @Field()
  nextReviewDate!: Date;

  @Field()
  createdAt: Date = new Date();

  @Field()
  updatedAt: Date = new Date();

  constructor(
    id: string,
    userId: string,
    wordId: string,
    masteryLevel: number,
    timesReviewed: number,
    reviewHistory: ReviewHistoryEntry[],
    nextReviewDate: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.wordId = wordId;
    this.masteryLevel = masteryLevel;
    this.timesReviewed = timesReviewed;
    this.reviewHistory = reviewHistory;
    this.nextReviewDate = nextReviewDate;
  }
}
