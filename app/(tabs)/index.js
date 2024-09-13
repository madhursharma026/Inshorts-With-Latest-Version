import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import { APIURL } from "@env";
import { useRouter } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import UseDynamicStyles from "../../context/UseDynamicStyles";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Config from "react-native-config";

// Apollo Client setup
const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

const GET_NEWS_BY_LANGUAGE_QUERY = gql`
  query {
    articles {
      id
      title
      description
      imageURL
      createdAt
    }
  }
`;

const DiscoverScreen = () => {
  const router = useRouter();
  const dynamicStyles = UseDynamicStyles();
  const { width } = useWindowDimensions();
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleArticles, setVisibleArticles] = useState(2);

  const fetchArticles = async () => {
    try {
      const { data } = await client.query({
        query: GET_NEWS_BY_LANGUAGE_QUERY,
      });
      setArticles(data.articles || []);
      setError(null);
    } catch (err) {
      setError("Failed to load articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const articlesToShow = useMemo(
    () => articles.slice(0, visibleArticles),
    [articles, visibleArticles]
  );

  if (loading) {
    return (
      <View style={[tw`flex-1 justify-center`, dynamicStyles.backgroundColor]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        tw`flex-grow p-2.5`,
        dynamicStyles.backgroundColor,
      ]}
    >
      <View
        style={tw`absolute top-0 right-0 -mt-44 -mr-40 w-80 h-80 bg-purple-100 rounded-full`}
      />

      <View style={tw`px-2.5 pb-4 pb-9 pt-9`}>
        <Text
          style={[tw`text-4xl rounded-xl font-bold`, dynamicStyles.textColor]}
        >
          Inshorts Clone
        </Text>
        <Text style={tw`text-sm text-gray-500`}>
          Financial News made simple
        </Text>
      </View>
      <View style={[tw`flex-1 p-2.5`, dynamicStyles.backgroundColor]}>
        <Text
          style={[
            tw`text-xl pb-4 rounded-xl font-bold`,
            dynamicStyles.textColor,
          ]}
        >
          All Articles
        </Text>
        {error ? (
          <>
            <View style={tw`flex-1 justify-center mt-4`}>
              <Text style={tw`text-red-500 text-xl`}>{error}</Text>
            </View>
            <TouchableOpacity
              onPress={fetchArticles}
              style={tw`p-2.5 mt-8 bg-red-500 rounded-lg`}
            >
              <Text style={tw`text-white text-center font-semibold`}>
                Retry, Fetch Articles
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {articlesToShow.map((article) => (
              // <TouchableOpacity
              //   onPress={() =>
              //     router.push({
              //       pathname: "/SingleArticle",
              //       params: {
              //         title: article.title,
              //         imageURL: article.imageURL,
              //         description: article.description,
              //       },
              //     })
              //   }
              // >
              //   <View
              //     key={article.id}
              //     style={tw`flex-col w-full border-b pb-3 mb-3 border-gray-300`}
              //   >
              //     <View style={tw`flex-row items-start`}>
              //       <View style={tw`flex-1`}>
              //         <Text
              //           style={[
              //             tw`text-lg font-semibold mb-1`,
              //             dynamicStyles.textColor,
              //           ]}
              //           numberOfLines={3}
              //         >
              //           {article?.title}
              //         </Text>
              //       </View>
              //       <Image
              //         source={{
              //           uri:
              //             article.imageURL ||
              //             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVLDP5s2j9u1x86fOb7kNKXanJeMn8zZ30ZQ&s",
              //         }}
              //         style={tw`w-20 h-20 ml-4 rounded-md`}
              //         resizeMode="cover"
              //       />
              //     </View>
              //     <View style={tw`mt-2`}>
              //       <RenderHTML
              //         contentWidth={width}
              //         source={{
              //           html: `${
              //             article?.description?.length > 120
              //               ? `${article.description.slice(0, 120)}...`
              //               : article.description || ""
              //           }`,
              //         }}
              //         baseStyle={{
              //           ...tw`text-base`,
              //           ...dynamicStyles.textColor,
              //         }}
              //       />
              //     </View>
              //   </View>
              // </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/SingleArticle",
                    params: {
                      title: article.title,
                      imageURL: article.imageURL,
                      description: article.description,
                    },
                  })
                }
                activeOpacity={1} // Prevents changing opacity on press
                style={tw`mb-4`} // Move the margin-bottom to TouchableOpacity
              >
                <View
                  key={article.id}
                  style={tw`bg-white rounded-xl p-4 mb-4 shadow-lg shadow-blue-500`} // Removed shadow-md to avoid shadow
                >
                  <View style={tw`flex-row`}>
                    <View style={tw`flex-1 pr-4`}>
                      <Text
                        style={tw`text-lg font-semibold mb-2 text-gray-900`}
                        numberOfLines={3}
                      >
                        {article?.title}
                      </Text>
                    </View>
                    <Image
                      source={require("../../assets/favicon.png")} // Replace with article.imageURL if dynamic
                      style={tw`w-16 h-16`} // Fixed size for image
                    />
                  </View>
                  <View style={tw`mt-2`}>
                    <RenderHTML
                      contentWidth={width}
                      source={{
                        html: `${
                          article?.description?.length > 155
                            ? `${article.description.slice(0, 155)}...`
                            : article.description || ""
                        }`,
                      }}
                      baseStyle={{
                        ...tw`text-base`,
                        ...{ color: "#333" }, // Replace with dynamicStyles.textColor if needed
                      }}
                    />
                  </View>
                  <Text style={tw`text-xs text-gray-500 mt-2`}>
                    {formatDistanceToNow(new Date(`${article?.createdAt}`), {
                      addSuffix: true,
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            {visibleArticles < articles.length && (
              <TouchableOpacity
                onPress={() => setVisibleArticles((prev) => prev + 2)}
                style={tw`p-2.5 bg-blue-500 rounded-lg`}
              >
                <Text style={tw`text-white text-center font-semibold`}>
                  More Articles
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default DiscoverScreen;
