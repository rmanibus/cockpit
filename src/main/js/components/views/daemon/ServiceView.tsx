import React from 'react';
import { message, Space } from 'antd';
import api from 'api';
import { ServiceProps } from './types';

export const ServiceView: React.FC<ServiceProps> = ({ dockerId, serviceId }: ServiceProps) => {
  const [service, setService] = React.useState(null);


  React.useEffect(() => {
    dockerId && serviceId && api
      .get('daemon/' + dockerId + '/services/' + serviceId)
      .then((res) => {
        setService(res.data);
      })
      .catch(() => {
        message.error('failed to fetch service ' + serviceId);
      });
  }, [dockerId, serviceId]);

  return (
    <>
      <h2>{service && service.Spec.Name}</h2>
        {service && service.CreatedAt}<br/>
        
    </>
  );
};