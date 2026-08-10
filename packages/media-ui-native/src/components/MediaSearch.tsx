import {
  Pressable,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { useState } from "react";

export interface MediaSearchProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
}

export function MediaSearch({
  initialQuery = "",
  onSearch,
  loading = false,
  containerStyle,
  inputStyle,
  buttonStyle,
  buttonTextStyle,
}: MediaSearchProps) {
  const [query, setQuery] = useState(initialQuery);

  const normalizedQuery = query.trim();
  const disabled = loading || !normalizedQuery;

  const handleSearch = () => {
    if (disabled) {
      return;
    }

    onSearch(normalizedQuery);
  };

  return (
    <View style={containerStyle}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search media..."
        accessibilityLabel="Search media"
        editable={!loading}
        style={inputStyle}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />

      <Pressable
        onPress={handleSearch}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{
          disabled,
          busy: loading,
        }}
        style={buttonStyle}
      >
        <Text style={buttonTextStyle}>
          {loading ? "Searching..." : "Search"}
        </Text>
      </Pressable>
    </View>
  );
}