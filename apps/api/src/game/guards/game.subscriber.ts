import { Injectable } from '@nestjs/common';
import { Game } from '@playpal/schemas';
import { 
  EntitySubscriberInterface, 
  EventSubscriber, 
} from 'typeorm';

@Injectable()
@EventSubscriber()
export class GameSubscriber implements EntitySubscriberInterface<Game> {
  listenTo() {
    return Game;
  }

  afterLoad(entity: Game) {    
    try {
      if (entity && entity.rating && entity.rating.length > 0) {
        const total = entity.rating.reduce((sum, rating) => sum + rating.note, 0);
        entity.averageRating = Number.parseFloat((total / entity.rating.length).toFixed(1));
        
        const countMap = entity.rating.reduce((accumulator, rating) => {
          accumulator[rating.note] = (accumulator[rating.note] || 0) + 1;
          return accumulator;
        }, {} as Record<number, number>);
        
        entity.count = Object.entries(countMap).map(([rating, count]) => ({
          rating: Number.parseInt(rating, 10),
          count
        }));
      }
    } catch (error) {
      console.error('Error in afterLoad game', error);
    }
  }
}