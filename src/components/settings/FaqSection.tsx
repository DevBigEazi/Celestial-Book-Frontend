import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";

const FAQS = [
  {
    id: "faq-1",
    question: "How do swipes work?",
    answer:
      "Swipe right to save a book to your To Be Read list. Swipe left to let it drift on. Your swipes help Celestial tailor future book constellations to your exact aesthetic preferences and emotional appetite.",
  },
  {
    id: "faq-2",
    question: "Can I change my reader persona?",
    answer:
      "Yes — retake the persona quiz at any time from your profile above. Your recommendations, atmosphere weighting, and daily book picks will immediately recalibrate to mirror your new aesthetic identity.",
  },
  {
    id: "faq-3",
    question: "Where can I find books I liked?",
    answer:
      "All saved worlds live in your TBR tab under 'Want to Read' or 'Currently Reading'. External purchased volumes from Google Play Books or Amazon Kindle live under 'Your Library'.",
  },
  {
    id: "faq-4",
    question: "What is TBR?",
    answer:
      "To Be Read — your sacred constellation of stories waiting to be unraveled. You can organize books into Want to Read, Currently Reading, and Finished.",
  },
  {
    id: "faq-5",
    question: "What does the free month include?",
    answer:
      "Your first 30 days unlock unlimited swiping, full access to all reading circle discussions, and atmosphere matching, regardless of subscription tier.",
  },
];

export function FaqSection() {
  const { colors } = useTheme();
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({
    "faq-1": true,
  });

  const handleToggle = (id: string) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="help-buoy-outline" size={18} color={colors.accent} />
          <Typography
            variant="subtitle"
            color={colors.textPrimary}
            style={styles.sectionTitle}
          >
            Help &amp; FAQs
          </Typography>
        </View>
        <Typography
          variant="caption"
          color={colors.textMuted}
          style={styles.sectionSubtitle}
        >
          Quiet answers to whispered questions.
        </Typography>
      </View>

      <Card style={styles.card} variant="outlined">
        {FAQS.map((faq, idx) => {
          const isExpanded = !!expandedFaqs[faq.id];
          const isLast = idx === FAQS.length - 1;

          return (
            <View key={faq.id}>
              <Pressable
                onPress={() => handleToggle(faq.id)}
                style={styles.faqHeaderRow}
              >
                <Typography
                  variant="body"
                  color={colors.textPrimary}
                  style={styles.faqQuestion}
                >
                  {faq.question}
                </Typography>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colors.accent}
                />
              </Pressable>

              {isExpanded && (
                <Typography
                  variant="caption"
                  color={colors.textSecondary}
                  style={styles.faqAnswer}
                >
                  {faq.answer}
                </Typography>
              )}

              {!isLast && (
                <View
                  style={[styles.divider, { backgroundColor: colors.divider }]}
                />
              )}
            </View>
          );
        })}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing["4"],
  },
  sectionHeader: {
    marginBottom: Spacing["2"],
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontStyle: "italic",
    marginTop: 2,
  },
  card: {
    padding: Spacing["4"],
  },
  faqHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing["1"],
  },
  faqQuestion: {
    fontWeight: "600",
    flex: 1,
    paddingRight: Spacing["2"],
    fontSize: 13,
  },
  faqAnswer: {
    lineHeight: 18,
    marginTop: Spacing["2"],
  },
  divider: {
    height: 1,
    marginVertical: Spacing["3"],
  },
});
