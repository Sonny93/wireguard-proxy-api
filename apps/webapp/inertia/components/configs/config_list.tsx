import { Data } from '@generated/data';
import { ConfigListItem } from '~/components/configs/config_list_item';
import type { ActiveProxy } from '~/pages/home';

interface ConfigListProps {
	configs: Data.Config[];
	activeProxies: ActiveProxy[];
}

export const ConfigList = ({
	configs,
	activeProxies,
}: Readonly<ConfigListProps>) => (
	<ul className="flex flex-col gap-3" role="list">
		{configs.map((config) => (
			<ConfigListItem
				key={config.id}
				config={config}
				activeProxies={activeProxies}
			/>
		))}
	</ul>
);
