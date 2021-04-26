// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as vscode from "vscode";
import { initializeApi } from "./api";
import { initializeGitApi } from "./git";
import { registerLiveShareModule } from "./liveShare";
import { registerPlayerModule } from "./player";
import { registerRecorderModule } from "./recorder";
import { selectTour, startCodeTour } from "./store/actions";
import { discoverTours } from "./store/provider";
import { store } from "./store";
import { getWorkspaceKey } from "./utils";

export async function activate(context: vscode.ExtensionContext) {
  registerPlayerModule(context);
  registerRecorderModule();
  registerLiveShareModule();

  if (vscode.workspace.workspaceFolders) {
    await discoverTours();

    const workspaceRoot = getWorkspaceKey();
    const primaryTour =
      store.tours.find(tour => tour.isPrimary) ||
      store.tours.find(tour => tour.title.match(/^#?1\s+-/));

    if (primaryTour) {
      startCodeTour(primaryTour, 0, workspaceRoot, false, undefined, store.tours);
    } else {
      selectTour(store.tours, workspaceRoot);
    }

    initializeGitApi();
  }

  return initializeApi(context);
}
