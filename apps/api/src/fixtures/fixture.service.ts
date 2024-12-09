import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, Loan, Product, Rating, Role, Rule, State, Tag, User, Wish } from '@playpal/schemas';
import { Repository } from 'typeorm';

@Injectable()
export class FixturesService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(Rule)
    private ruleRepository: Repository<Rule>
  ) {}

  async onModuleInit() {
    const userCount = await this.userRepository.count();
    const tagCount = await this.tagRepository.count();
    const gameCount = await this.gameRepository.count();
    const ratingCount = await this.ratingRepository.count();
    const productCount = await this.productRepository.count();
    const loanCount = await this.loanRepository.count();
    const wishCount = await this.wishRepository.count();
    const ruleCount = await this.ruleRepository.count();

    if ([userCount, gameCount, tagCount, ratingCount, productCount, loanCount, wishCount, ruleCount].every(count => count === 0)) {
      const savedUsers = await this.loadFixturesUsers();
      const savedTags = await this.loadFixturesTags();
      const savedGames = await this.loadFixturesGames(savedTags);
      await this.loadFixturesRatings(savedUsers, savedGames);
      const savedProduct = await this.loadFixturesProducts(savedUsers, savedGames);
      await this.loadFixturesLoans(savedUsers, savedProduct);
      await this.loadFixturesRules(savedGames);
      await this.loadFixturesWish(savedUsers, savedGames);
    }
  }

  private async loadFixturesUsers() {
    const users = this.userRepository.create([
      { 
        username: 'admin', 
        email: 'admin@example.com',
        password: '$2b$12$FnOHpXz.4AkurcFVazsmRefZ.TDap6lwgMa8XUMXzgOhzBfBqFgsS', // Admin01
        role: Role.Admin,
        rating: [],
        loan: [],
        product: []
      },
      { 
        username: 'customer', 
        email: 'customer@example.com',
        password: '$2y$10$hd4tQ9pRo4BCKlPDMZYBU.QDbS89.Vvhy16ZEZK1dlErDHihnrtDO', // Customer01
        role: Role.Customer,
        rating: [],
        loan: [],
        product: []
      },
      { 
        username: 'customer2', 
        email: 'customer2@example.com',
        password: '$2y$10$hd4tQ9pRo4BCKlPDMZYBU.QDbS89.Vvhy16ZEZK1dlErDHihnrtDO', // Customer01
        role: Role.Customer,
        rating: [],
        loan: [],
        product: []
      },
    ]);
    const savedUsers = await this.userRepository.save(users);
    return savedUsers;
  }

  private async loadFixturesTags() {
    const tags = this.tagRepository.create([
      {
        name: "Social"
      },
      {
        name: "Intellectuel"
      },
      {
        name: "Coopératif"
      },
      {
        name: "Ambiance"
      }
    ]);
    const savedTags = await this.tagRepository.save(tags);
    return savedTags;
  }

  private async loadFixturesGames(savedTags: Tag[]) {
    const [social, intellectuel, cooperatif, ambiance] = savedTags;
    
    const games = this.gameRepository.create([
      { 
        name: "Skyjo",
        description: "Un jeu ludique de couleurs",
        minPlayers: 2,
        maxPlayers: 8,
        minYear: 3,
        difficulty: 5,
        duration: "20min",
        brand: "Magilano",
        rating: [],
        product: [],
        tags: [social, intellectuel, ambiance]
      },
      { 
        name: "Galerapagos",
        description: "Un jeu où l'on doit survivre avec ses amis",
        minPlayers: 4,
        maxPlayers: 8,
        minYear: 3,
        difficulty: 5,
        duration: "30min",
        brand: "Gigamic",
        rating: [],
        product: [],
        tags: [cooperatif, social]
      },
    ]);

    const savedGames = await this.gameRepository.save(games);
    return savedGames;
  }

  private async loadFixturesRatings(savedUsers: User[], savedGames: Game[]) {
    const [skyjo, galerapagos] = savedGames;
    const [, customer, customer2] = savedUsers;
    
    const ratings = this.ratingRepository.create([
      { 
        comment: "Nice game !",
        note: 5,
        user: customer,
        game: skyjo
      },
      { 
        comment: "I dont like this game",
        note: 1,
        user: customer2,
        game: galerapagos
      },
    ]);

    const savedRatings = await this.ratingRepository.save(ratings);
    return savedRatings;
  }

  private async loadFixturesProducts(savedUsers: User[], savedGames: Game[]) {
    const [skyjo, galerapagos] = savedGames;
    const [, customer, customer2] = savedUsers;
    
    const products = this.productRepository.create([
      { 
        state: State.NEW,
        available: false,
        user: customer,
        game: skyjo,
        loan: []
      },
      { 
        state: State.GOOD,
        available: false,
        user: customer2,
        game: galerapagos,
        loan: []
      },
      { 
        state: State.BROKEN,
        available: true,
        user: null,
        game: skyjo,
        loan: []
      },
    ]);

    const savedProducts = await this.productRepository.save(products);
    return savedProducts;
  }

  private async loadFixturesLoans(savedUsers: User[], savedProducts: Product[]) {
    const [skyjo, galerapagos] = savedProducts;
    const [, customer, customer2] = savedUsers;
  
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 7);
  
    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 7);
  
    const loans = this.loanRepository.create([
      {
        endDate: futureDate1,
        product: skyjo,
        user: customer,
      },
      {
        endDate: futureDate2,
        product: galerapagos,
        user: customer2,
      },
    ]);
  
    if (!futureDate1 || !futureDate2) {
      throw new Error("Invalid dates provided.");
    }
  
    const savedLoans = await this.loanRepository.save(loans);
    return savedLoans;
  }
  

  private async loadFixturesWish(savedUsers: User[], savedGames: Game[]) {
    const [skyjo, galerapagos] = savedGames;
    const [, customer, customer2] = savedUsers;
    const wish = this.wishRepository.create([
      { 
        user: customer,
        game: skyjo,
      },
      {
        user: customer,
        game: galerapagos
      },
      {
        user: customer2,
        game: galerapagos
      }
    ]);

    const savedWish = await this.wishRepository.save(wish);
    return savedWish;
  }

  private async loadFixturesRules(savedGames: Game[]) {
    const [skyjo, galerapagos] = savedGames;
    
    const rules = this.ruleRepository.create([
      { 
        game: skyjo,
        title: "Règle générale",
        description: "Les joueurs tirent les cartes chacun leur tour, jusqu'à ce qu'un des joueurs aie toutes les cartes de révélées"
      },
      {
        game: galerapagos,
        title: "Règle générale",
        description: "Les joueurs sont sur une île déserte et doivent s'enfuir, ils doivent trouver des ressources pour survivre et pouvoir s'enfuir de l'île avec tous les participants (ou pas)"
      }
    ]);

    const savedRules = await this.ruleRepository.save(rules);
    return savedRules;
  }
}
