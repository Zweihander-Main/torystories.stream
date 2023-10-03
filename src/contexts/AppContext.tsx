import React, { ReactNode } from 'react';
import { StorageProvider } from './StorageContext';
import { PlayerProgressProvider } from './PlayerProgressContext';
import { PlayerStateProvider } from './PlayerStateContext';
import { TrackProvider } from './TrackContext';

const AppProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
	return (
		<StorageProvider>
			<PlayerStateProvider>
				<TrackProvider>
					<PlayerProgressProvider>{children}</PlayerProgressProvider>
				</TrackProvider>
			</PlayerStateProvider>
		</StorageProvider>
	);
};

export default AppProvider;
