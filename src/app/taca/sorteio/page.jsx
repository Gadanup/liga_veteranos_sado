import { redirect } from "next/navigation";

/**
 * The 2024 knockout bracket used to be rendered here, from a hook with the
 * season and a match id hardcoded. /taca renders the same bracket for any
 * knockout season, so this route is a duplicate implementation.
 *
 * Old links land on /taca and the 2024 bracket is one pick away in the season
 * selector. The season is not carried over because /taca does not read it from
 * the URL yet — that is step 1.2.3 (useSelectedSeason, C3); once it does, this
 * should become /taca?epoca=2024.
 */
export default function CupDrawRedirect() {
  redirect("/taca");
}
