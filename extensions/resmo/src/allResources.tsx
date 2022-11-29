import { ActionPanel, Action, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";
import { getPreferenceValues } from "@raycast/api";
import { MetaType } from "./query";

interface ResourceRow extends MetaType {
  name: string;
  referencedType: string;
}
interface Resources {
  rows: ResourceRow[];
  fields: {
    name: string;
    type: string;
    isImportant: boolean;
  }[];
}

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const tmpDomain = `${getPreferenceValues().resmoDomain}`;
  const resmoDomain = tmpDomain.endsWith("/") ? tmpDomain : tmpDomain + "/";
  const resmoApiKey = `${getPreferenceValues().resmoApiKey}`;

  const { data, isLoading } = useFetch<Resources>(resmoDomain + "api/explore/all/resources", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + resmoApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ freeText: searchText, integrations: [], riskScores: [], resourceTypes: [], fields: [] }),
  });

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search within your resources..."
      throttle
    >
      <List.Section title="Results" subtitle={String(data?.rows?.length)}>
        {data?.rows?.map((row, index) => (
          <ResourcesListItem
            key={row.name + "-" + row.referencedType + "-" + index}
            resource={row}
            resmoDomain={resmoDomain}
          />
        ))}
      </List.Section>
    </List>
  );
}

function ResourcesListItem({ resource, resmoDomain }: { resource: ResourceRow; resmoDomain: string }) {
  return (
    <List.Item
      title={resource.name}
      subtitle={resource.referencedType}
      icon={"https://static.resmo.com/integrations/icons/" + resource._meta.integration.type + ".svg"}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action.OpenInBrowser
              title="Open in Browser"
              url={resmoDomain + "explore/resources/" + resource._meta.type + "/" + resource._meta.recordId}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
