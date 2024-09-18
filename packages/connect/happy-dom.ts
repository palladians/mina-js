import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { BrowserNavigationCrossOriginPolicyEnum } from "happy-dom";

GlobalRegistrator.register({
	settings: {
		navigation: {
			crossOriginPolicy: BrowserNavigationCrossOriginPolicyEnum.anyOrigin,
		},
	},
});
