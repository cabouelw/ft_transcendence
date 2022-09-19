import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { Server, Socket } from 'socket.io';
import { friendDto } from 'src/friendship/friendship.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { conversationDto, createMsgDto, msgDto } from './chat.dto';
import { Conversation, Member, Message } from './chat.entity';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Conversation)
		private conversationRepository: Repository<Conversation>,
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
		@InjectRepository(Member)
		private memberRepository: Repository<Member>,
		private userService: UserService,
	) { }

	// async joinConversations(client: Socket) {
	// 	const convs: Conversation[] = await this.conversationRepository
	// 		.createQueryBuilder('conversations')
	// 		.where('conversations.sender = :login OR conversations.receiver = :login', { login: client.data.login })
	// 		.getMany();
	// 	if (!convs.length)
	// 		return ;
	// 	convs.forEach((conv) => (client.join(conv.id)));
	// }

	async getFriend(login: string) {
		return await this.userService.getFriend(login);
	}

	async getConversations(login: string) {
		// const convs: conversationDto[] = await this.memberRepository
		// 	.query(`select conversations.id as "convId", conversations.type, conversations.avatar, conversations.name, COUNT() from members Join users ON members."userId" = users.id Join conversations ON members."conversationId" = conversations.id where users."login" = '${login}';`);
		// const conversations: conversationDto[] = await Promise.all(convs.map(async (conv) => {
		// 	const convInfo: conversationDto = { ...conv }
		// 	if (conv.type === 'Dm') {
		// 		const users = await this.memberRepository
		// 			.query(`select users.login, users.fullname, users.status, users.avatar from members Join users ON members."userId" = users.id where members."conversationId" = '${conv.convId}' AND users.login != '${login}';`);
		// 		convInfo.name = users[0].fullname;
		// 		convInfo.status = users[0].status;
		// 		convInfo.avatar = users[0].avatar
		// 		return convInfo;
		// 	}
		// 	else {
		// 		convInfo.membersNum = 10;
		// 		return convInfo;
		// 	}
		// }))
		// return [...conversations];
		// const convs: Conversation[] = await this.conversationRepository
		// 	.createQueryBuilder('conversations')
		// 	.where('conversations.sender = :login OR conversations.receiver = :login', { login: login })
		// 	.orderBy('conversations.lastUpdate', 'DESC')
		// 	.getMany();
		// if (!convs.length)
		// 	return null;
		// const conversations = await Promise.all(convs.map(async (conv) => {
		// 	const friend: string = (conv.sender === login) ? conv.receiver : conv.sender;
		// 	const friendInfo: friendDto = await this.userService.getFriend(friend);
		// 	return { convId: conv.id, ...friendInfo }
		// }))
		// return [...conversations];
	}

	// async getConvById(convId: string) {
	// 	const conv: Conversation = await this.conversationRepository
	// 		.createQueryBuilder('conversations')
	// 		.where('conversations.id = :convId', { convId: convId })
	// 		.getOne();
	// 	return conv;
	// }

	// async updateConvDate(convId: string, date: Date) {
	// 	await this.conversationRepository
	// 		.createQueryBuilder('conversations')
	// 		.update({ lastUpdate: date })
	// 		.where('id = :convId', { convId: convId })
	// 		.execute();
	// }

	// async getMessages(convId: string) {
	// 	const msgs: Message[] = await this.messageRepository
	// 		.query(`SELECT messages."sender", messages."msg", messages."createDate" FROM messages where messages."conversationId" = '${convId}' order by messages."createDate" DESC;`)
	// 	if (!msgs.length)
	// 		return null;
	// 	return [...msgs];
	// }

	// async createConv(sender: string, receiver: string) {
	// 	const conv: Conversation = new Conversation();
	// 	conv.sender = sender;
	// 	conv.receiver = receiver;
	// 	return await this.conversationRepository.save(conv);
	// }

	// async storeMsg(msg: string, sender: string, convId: Conversation) {
	// 	let msgs: Message = new Message();
	// 	msgs.msg = msg;
	// 	msgs.sender = sender;
	// 	msgs.conversation = convId;
	// 	msgs = await this.messageRepository.save(msgs);
	// 	return msgs.createDate;
	// }

	// async createNewConv(server: Server, login: string, client: Socket, data: createMsgDto) {
	// 	const conv: Conversation = await this.createConv(login, data.receiver);
	// 	const date = await this.storeMsg(data.msg, login, conv);
	// 	client.join(conv.id);
	// 	const sockets = await server.fetchSockets();
	// 	const friendSocket = sockets.find((socket) => (socket.data.login === data.receiver))
	// 	if (friendSocket)
	// 		friendSocket.join(conv.id);
	// 	const msg: msgDto = { msg: data.msg, sender: login, date: date, convId: conv.id };
	// 	return msg;
	// }

	// async createNewMessage(login: string, data: createMsgDto) {
	// 	const conv = await this.getConvById(data.convId);
	// 	const date = await this.storeMsg(data.msg, login, conv);
	// 	this.updateConvDate(conv.id, date);
	// 	const msg: msgDto = { msg: data.msg, sender: login, date: date, convId: conv.id };
	// 	return msg;
	// }
}
