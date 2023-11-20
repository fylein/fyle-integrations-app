import { FeatureConfiguration } from '../core/models/misc/feature-configuration.model';
import config from './config.json';

export const brandingConfig = config;

const featureConfigs: FeatureConfiguration = {
    fyle: {
        reimbursableExpenses: true
    },
    coco: {
        reimbursableExpenses: false
    }
};

// @ts-ignore
export const brandingFeatureConfig = featureConfigs[brandingConfig.brandId];
