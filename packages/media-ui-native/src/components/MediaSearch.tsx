import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useState } from "react";

export interface MediaSearchProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
}

export function MediaSearch({
  initialQuery = "",
  onSearch,
  loading = false,
}: MediaSearchProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = () => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery || loading) {
      return;
    }

    onSearch(normalizedQuery);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search media..."
        accessibilityLabel="Search media"
        style={styles.input}
        editable={!loading}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />

      <Pressable
        onPress={handleSearch}
        disabled={loading || !query.trim()}
        style={[
          styles.button,
          (loading || !query.trim()) && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>
          {loading ? "Searching..." : "Search"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },

  input: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
  },

  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#111827",
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 14,
  },
});
