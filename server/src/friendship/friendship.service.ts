import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { friendDto } from './friendship.dto';
import { Friendship, userRelation } from './friendship.entity';

@Injectable()
export class FriendshipService {
	constructor(
		@InjectRepository(Friendship)
		private friendshipRepository: Repository<Friendship>,
		private readonly userService: UserService,
	) { }

	async getFriends(login: string) {
		const friends: Friendship[] = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.user', 'friendships.friend'])
			.where('friendships.relation = :relation AND (friendships.user = :login OR friendships.friend = :login)', { relation: userRelation.FRIEND, login: login })
			.getMany();
		if (!friends.length)
			return friends;
		const friendList = await Promise.all(friends.map(async (friend) => {
			const friendLogin = (friend.user === login) ? friend.friend : friend.user;
			const friendInfo: friendDto = await this.userService.getFriend(friendLogin);
			return  friendInfo;
		}))
		return [...friendList];
	}

	async getPendings(login: string) {
		const pendings: Friendship[] = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.user'])
			.where('friendships.relation = :relation AND friendships.friend = :login', { relation: userRelation.PENDING, login: login })
			.getMany();
		return [...pendings];
	}

	async getBlocked(login: string) {
		const blocked: Friendship[] = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.user', 'friendships.friend'])
			.where('friendships.relation = :relation AND friendships.user = :login', { relation: userRelation.BLOCKED, login: login })
			.getMany();
		return [...blocked];
	}
}
