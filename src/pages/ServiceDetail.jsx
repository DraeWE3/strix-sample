import { useParams } from "react-router-dom";
import ServiceDetailPage from "../components/serviceDetail/ServiceDetailPage";
import NotFound from "./NotFound";
import { getServiceDetail } from "../data/serviceDetails";

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = getServiceDetail(slug);
  if (!service) return <NotFound />;
  return <ServiceDetailPage key={slug} service={service} />;
};

export default ServiceDetail;
