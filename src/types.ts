// Firefox Android Home Recommendation
// this is the type we return to Firefox
export type FAHRecommendation = {
  url: string;
  publisher: string;
  imageUrl: string;
  title: string;
  timeToRead: number | null;
  category: string;
};

export type FAHRecommendationResponse = {
  recommendations: FAHRecommendation[];
};

// the below types are those coming from Client API
export type ClientApiResponse = {
  data: {
    getSlateLineup: {
      slates: ClientApiSlate[];
    };
  };
};

export type ClientApiDomainMeta = {
  name: string;
};

export type ClientApiItem = {
  resolvedUrl: string;
  title: string;
  topImageUrl: string;
  timeToRead: number | null;
  domainMetadata: ClientApiDomainMeta;
};

export type ClientApiRecommendation = {
  item: ClientApiItem;
};

export type ClientApiSlate = {
  description: string;
  recommendations: ClientApiRecommendation[];
};
