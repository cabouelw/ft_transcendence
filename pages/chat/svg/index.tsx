import { color } from "@interfaces/chat"
import Styles from "@styles/chat.module.css"

export function GameIconAsset({ color }: color) {
	return (<>
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
			<path className={Styles.console} fill-rule="evenodd" clip-rule="evenodd" d="M12 0.8125C12.5178 0.8125 12.9375 1.23223 12.9375 1.75V3.92112C14.7268 3.94569 16.5153 4.04058 18.299 4.2058L18.7135 4.2442C21.5444 4.50643 23.7243 6.85725 23.7724 9.69987L23.7875 10.5917C23.8463 14.0602 23.5667 17.5262 22.9527 20.9405C22.6733 22.4943 21.3212 23.625 19.7424 23.625H19.4661C18.0455 23.625 16.7583 22.7878 16.1824 21.4892L14.8566 18.5001C13.7579 16.0227 10.2421 16.0227 9.14336 18.5001L7.81761 21.4892C7.24164 22.7878 5.95447 23.625 4.53386 23.625H4.25755C2.67879 23.625 1.32666 22.4943 1.04723 20.9405C0.433238 17.5262 0.153649 14.0602 0.212435 10.5917L0.22755 9.69988C0.275728 6.85725 2.45562 4.50643 5.28653 4.2442L5.70103 4.2058C7.48469 4.04058 9.27323 3.94569 11.0625 3.92112V1.75C11.0625 1.23223 11.4822 0.8125 12 0.8125ZM18.25 8C18.25 7.30964 17.6903 6.75 17 6.75C16.3096 6.75 15.75 7.30964 15.75 8V8.3125C15.75 9.00286 16.3096 9.5625 17 9.5625C17.6903 9.5625 18.25 9.00286 18.25 8.3125V8ZM6.99999 7.0625C7.51776 7.0625 7.93749 7.48223 7.93749 8V9.5625H9.49999C10.0178 9.5625 10.4375 9.98223 10.4375 10.5C10.4375 11.0178 10.0178 11.4375 9.49999 11.4375H7.93749V13C7.93749 13.5178 7.51776 13.9375 6.99999 13.9375C6.48222 13.9375 6.06249 13.5178 6.06249 13V11.4375H4.49999C3.98222 11.4375 3.56249 11.0178 3.56249 10.5C3.56249 9.98223 3.98222 9.5625 4.49999 9.5625L6.06249 9.5625V8C6.06249 7.48223 6.48222 7.0625 6.99999 7.0625ZM17 11.4375C17.6903 11.4375 18.25 11.9971 18.25 12.6875V13C18.25 13.6904 17.6903 14.25 17 14.25C16.3096 14.25 15.75 13.6904 15.75 13V12.6875C15.75 11.9971 16.3096 11.4375 17 11.4375ZM19.5 11.75C20.1903 11.75 20.75 11.1904 20.75 10.5C20.75 9.80964 20.1903 9.25 19.5 9.25H19.1875C18.4971 9.25 17.9375 9.80964 17.9375 10.5C17.9375 11.1904 18.4971 11.75 19.1875 11.75H19.5ZM16.0625 10.5C16.0625 11.1904 15.5028 11.75 14.8125 11.75H14.5C13.8096 11.75 13.25 11.1904 13.25 10.5C13.25 9.80964 13.8096 9.25 14.5 9.25H14.8125C15.5028 9.25 16.0625 9.80964 16.0625 10.5Z" fill={color} />
		</svg>
	</>)
}

export function ChannelAsset({ color }: color) {
	return (<>
		<svg className={Styles.console} width="20" height="20" viewBox="0 0 20 20" fill={color} xmlns="http://www.w3.org/2000/svg">
			<path d="M4.17528 10C4.17528 9.51678 4.56703 9.12503 5.05028 9.12503H9.125V5.05028C9.125 4.56703 9.51675 4.17528 10 4.17528C10.4832 4.17528 10.875 4.56703 10.875 5.05028V9.12503H14.9498C15.433 9.12503 15.8248 9.51678 15.8248 10C15.8248 10.4833 15.433 10.875 14.9498 10.875H10.875V14.9498C10.875 15.433 10.4832 15.8248 10 15.8248C9.51675 15.8248 9.125 15.433 9.125 14.9498V10.875H5.05028C4.56703 10.875 4.17528 10.4833 4.17528 10Z" fill={color} />
			<path fill-rule="evenodd" clip-rule="evenodd" d="M4.53619 0.396915C8.13833 -0.00567746 11.8616 -0.00567746 15.4638 0.396915C17.5946 0.635061 19.3153 2.31348 19.5659 4.4566C19.9967 8.13967 19.9967 11.8604 19.5659 15.5435C19.3153 17.6866 17.5946 19.365 15.4638 19.6032C11.8616 20.0058 8.13834 20.0058 4.53619 19.6032C2.40541 19.365 0.684696 17.6866 0.434039 15.5435C0.00326965 11.8604 0.00326972 8.13967 0.434039 4.4566C0.684696 2.31348 2.40541 0.635061 4.53619 0.396915ZM15.2694 2.13609C11.7964 1.74793 8.20353 1.74793 4.73057 2.13609C3.3954 2.28531 2.32667 3.3391 2.17219 4.65989C1.75722 8.2079 1.75722 11.7922 2.17219 15.3402C2.32667 16.661 3.3954 17.7148 4.73057 17.864C8.20353 18.2521 11.7964 18.2521 15.2694 17.864C16.6046 17.7148 17.6733 16.661 17.8278 15.3402C18.2427 11.7922 18.2427 8.2079 17.8278 4.65989C17.6733 3.3391 16.6046 2.28531 15.2694 2.13609Z" fill={color} />
		</svg>
	</>)
}