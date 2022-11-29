import { ActionPanel, Action, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";
import { getPreferenceValues } from "@raycast/api";
import { debounce } from "lodash";

export const integrationIconURL = (integrationId: string) =>
  `https://static.resmo.com/integrations/icons/${integrationId}.svg`;
export interface MetaType {
  _meta: {
    type: string;
    id: string;
    recordId: string;
    groupKey: string;
    integration: {
      id: string;
      name: string;
      type: string;
      tags: string[];
    };
    recordedAt: string;
    complianceStatus: {
      COMPLIANT: number;
      NON_COMPLIANT: number;
      SUPPRESSED: number;
    };
    resourceGroups: {
      id: string;
      name: string;
      slug: string;
    }[];
    riskScore: number;
    name: string;
  };
}

type Result = Record<string, string | number | unknown> & Partial<MetaType>;

export type SearchResponse = {
  results: Result[];
  resultType: "JSON" | "TABLE";
  id: string;
  duration: number;
  fields: Record<string, unknown>[];
  error?: string;
};

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const tmpDomain = `${getPreferenceValues().resmoDomain}`;
  const resmoDomain = tmpDomain.endsWith("/") ? tmpDomain : tmpDomain + "/";
  const resmoApiKey = `${getPreferenceValues().resmoApiKey}`;

  const { data, isLoading } = useFetch<SearchResponse>(resmoDomain + "api/query", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + resmoApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sql: searchText,
      resourceGroupId: "",
    }),
  });

  const resultsCanBeListed = data?.resultType === "TABLE";
  const results = !resultsCanBeListed ? [] : data.results.filter((result) => result._meta);

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={debounce(setSearchText, 300)}
      searchBarPlaceholder="SELECT * FROM user"
    >
      <List.Section title="Results" subtitle={String(results.length)}>
        {results.map((result) => (
          <QueryListItem
            key={result._meta?.id + "-" + result._meta?.recordId}
            result={result}
            resmoDomain={resmoDomain}
          />
        ))}
        {!isLoading && results?.length === 0 && <NoResultListItem resmoDomain={resmoDomain} />}
      </List.Section>
    </List>
  );
}

function NoResultListItem({ resmoDomain }: { resmoDomain: string }) {
  return (
    <List.Item
      title="Continue from Resmo UI"
      actions={
        <ActionPanel>
          <Action.OpenInBrowser title="Open in Browser" url={resmoDomain + "explore/search"} />
        </ActionPanel>
      }
    />
  );
}

function QueryListItem({ result, resmoDomain }: { result: Result; resmoDomain: string }) {
  if (!result._meta) return null;

  return (
    <List.Item
      icon={integrationIconURL(result._meta.integration.type)}
      title={result._meta.name || result._meta?.id + " | " + result._meta?.recordId}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            title="Open in Browser"
            url={resmoDomain + "explore/resources/" + result._meta.type + "/" + result._meta.recordId}
          />
        </ActionPanel>
      }
    />
  );
}
