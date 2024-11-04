import { TestZkApp } from "../../components/test-zkapp";

const TestPage = () => {
	if (import.meta.env.SSR) return null;
	return <TestZkApp />;
};

export default TestPage;
