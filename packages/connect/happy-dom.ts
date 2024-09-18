import { GlobalRegistrator } from "@happy-dom/global-registrator";

const bunFetch = fetch;
GlobalRegistrator.register();
window.fetch = bunFetch;
